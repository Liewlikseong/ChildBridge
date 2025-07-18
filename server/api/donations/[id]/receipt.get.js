// server/api/donations/[id]/receipt.get.js
import PDFDocument from 'pdfkit';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'; 

export default defineEventHandler(async (event) => {
  try {
    console.log('=== Receipt Generation Started ===');
    
    const user = await serverSupabaseUser(event);
    const supabase = await serverSupabaseClient(event);
    const donationId = getRouterParam(event, 'id');

    console.log('User:', user?.id);
    console.log('Donation ID:', donationId);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    if (!donationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donation ID is required'
      });
    }

    // Get donation with simple query
    console.log('Fetching donation...');
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single();

    if (donationError) {
      console.error('Donation fetch error:', donationError);
      throw createError({
        statusCode: 404,
        statusMessage: 'Donation not found'
      });
    }

    if (!donation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Donation not found'
      });
    }

    console.log('Donation found:', {
      id: donation.id,
      type: donation.type,
      status: donation.status,
      donor_id: donation.donor_id,
      amount: donation.amount
    });

    // Check if donation belongs to user OR if it's a physical donation with matching email
    const userOwnsThisDonation = donation.donor_id === user.id || 
                                (donation.donor_email === user.email && donation.donor_email);
    
    if (!userOwnsThisDonation) {
      console.log('Access denied - donor_id mismatch');
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      });
    }

    if (donation.status !== 'completed') {
      throw createError({
        statusCode: 400,
        statusMessage: `Receipt only available for completed donations. Current status: ${donation.status}`
      });
    }

    // Try to get profile data (optional)
    let profileData = null;
    if (donation.donor_id) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', donation.donor_id)
          .single();
        
        profileData = profile;
        console.log('Profile data found:', !!profile);
      } catch (err) {
        console.log('Profile fetch failed, using fallback data');
      }
    }

    // Try to get event data (optional)
    let eventData = null;
    if (donation.event_id) {
      try {
        const { data: event } = await supabase
          .from('events')
          .select('title, description')
          .eq('id', donation.event_id)
          .single();
        
        eventData = event;
        console.log('Event data found:', !!event);
      } catch (err) {
        console.log('Event fetch failed, continuing without event data');
      }
    }

    console.log('Starting PDF generation...');

    // Generate PDF
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      info: {
        Title: `Donation Receipt - ${donation.id.substring(0, 8)}`,
        Author: 'Jing Sun Welfare Society',
        Subject: 'Donation Receipt'
      }
    });
    
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    
    const pdfPromise = new Promise((resolve, reject) => {
      doc.on('end', () => {
        console.log('PDF generation completed');
        resolve(Buffer.concat(chunks));
      });
      
      doc.on('error', (err) => {
        console.error('PDF generation error:', err);
        reject(err);
      });

      try {
        // === PDF CONTENT ===
        console.log('Adding PDF content...');
        
        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text('DONATION RECEIPT', { align: 'center' });
        
        doc.moveDown(0.5);
        
        doc.fontSize(12)
           .font('Helvetica')
           .text('Jing Sun Welfare Society', { align: 'center' })
           .text('123 Charity Lane, Kuala Lumpur, Malaysia', { align: 'center' })
           .text('contact@jingsun.org | +60 12-345 6789', { align: 'center' });
        
        doc.moveDown(2);

        // Receipt Details
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Receipt Details:');
        
        doc.moveDown(0.5);
        
        doc.fontSize(11)
           .font('Helvetica')
           .text(`Receipt ID: ${donation.id.substring(0, 8).toUpperCase()}`)
           .text(`Date: ${new Date(donation.created_at).toLocaleDateString('en-US', { 
             year: 'numeric', 
             month: 'long', 
             day: 'numeric' 
           })}`);
        
        // Donation Type
        let donationType = 'General Donation';
        if (donation.event_id && eventData) {
          donationType = 'Event Donation';
        } else if (donation.type === 'subscription') {
          donationType = 'Monthly Subscription';
        } else if (donation.type === 'physical') {
          donationType = 'Physical Donation';
        } else if (donation.type === 'onetime') {
          donationType = 'One-time Donation';
        }
        
        doc.text(`Type: ${donationType}`);
        
        // Category or Event
        if (donation.event_id && eventData) {
          doc.text(`Event: ${eventData.title}`);
          if (eventData.description) {
            doc.text(`Description: ${eventData.description}`);
          }
        } else {
          const category = (donation.category || 'general').charAt(0).toUpperCase() + 
                          (donation.category || 'general').slice(1);
          doc.text(`Category: ${category}`);
        }
        
        doc.moveDown(1);
        
        // Amount or Items
        if (donation.type === 'physical') {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text('Items Donated:');
          
          doc.fontSize(11)
             .font('Helvetica')
             .text(donation.message || 'Physical items as described by donor');
          
          doc.moveDown(0.5);
          doc.text('Estimated Value: As declared by donor', { 
            fontSize: 10, 
            color: 'gray' 
          });
        } else {
          doc.fontSize(16)
             .font('Helvetica-Bold')
             .text(`Amount: RM ${parseFloat(donation.amount || 0).toFixed(2)}`);
          
          if (donation.stripe_payment_intent_id) {
            doc.fontSize(10)
               .font('Helvetica')
               .text(`Transaction ID: ${donation.stripe_payment_intent_id}`);
          }
        }
        
        doc.moveDown(1.5);

        // Donor Information
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Donor Information:');
        
        doc.moveDown(0.5);
        
        // Determine donor name
        let donorName = 'Anonymous Donor';
        if (profileData?.first_name && profileData?.last_name) {
          donorName = `${profileData.first_name} ${profileData.last_name}`;
        } else if (donation.donor_name) {
          donorName = donation.donor_name;
        }
        
        // Determine donor email
        let donorEmail = 'N/A';
        if (profileData?.email) {
          donorEmail = profileData.email;
        } else if (donation.donor_email) {
          donorEmail = donation.donor_email;
        } else if (user.email) {
          donorEmail = user.email;
        }
        
        doc.fontSize(11)
           .font('Helvetica')
           .text(`Name: ${donorName}`)
           .text(`Email: ${donorEmail}`);
        
        doc.moveDown(2);

        // Thank You Message
        doc.fontSize(12)
           .font('Helvetica-Oblique')
           .text('Thank you for your generous donation!', { align: 'center' });
        
        doc.moveDown(0.5);
        
        doc.fontSize(10)
           .font('Helvetica')
           .text('Your contribution helps us continue our mission to make a positive impact in the community.', { align: 'center' });
        
        doc.moveDown(1);
        
        doc.text('This receipt serves as proof of your donation.', { align: 'center' });
        
        doc.moveDown(2);

        // Footer
        doc.fontSize(8)
           .font('Helvetica')
           .text(`Generated on ${new Date().toLocaleString()} | Jing Sun Welfare Society`, { 
             align: 'center',
             color: 'gray'
           });

        console.log('PDF content added, finalizing...');
        doc.end();
        
      } catch (pdfError) {
        console.error('Error during PDF content generation:', pdfError);
        reject(pdfError);
      }
    });

    // Wait for PDF generation
    const pdfBuffer = await pdfPromise;
    
    console.log('PDF generated successfully, size:', pdfBuffer.length);

    // Set response headers
    setHeader(event, 'Content-Type', 'application/pdf');
    setHeader(event, 'Content-Disposition', `attachment; filename="receipt-${donationId.substring(0, 8)}.pdf"`);
    setHeader(event, 'Content-Length', pdfBuffer.length.toString());
    
    return pdfBuffer;

  } catch (error) {
    console.error('=== Receipt Generation Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to generate receipt'
    });
  }
});