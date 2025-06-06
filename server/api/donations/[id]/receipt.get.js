import PDFDocument from 'pdfkit';
// Import Nuxt Supabase composables for server routes
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'; 

export default defineEventHandler(async (event) => {
  try {
    // Get the authenticated user from the server-side Supabase session
    const user = await serverSupabaseUser(event);
    // Get the Supabase client instance for server-side operations
    const supabase = await serverSupabaseClient(event);
    
    const donationId = getRouterParam(event, 'id'); // Get ID from URL parameter

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required. Please log in to view receipts.'
      });
    }
    if (!donationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donation ID is missing from the request.'
      });
    }

    // --- Fetch Donation Record from Supabase ---
    // Ensure the donor_id matches the authenticated user's ID
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select(`
        *,
        profiles:donor_id (
          full_name,
          email
        )
      `)
      .eq('id', donationId)
      .eq('donor_id', user.id) // IMPORTANT: Verify user owns this donation
      .eq('status', 'completed') // Only generate receipts for completed donations
      .single();

    if (fetchError || !donation) {
      console.error('Supabase fetch error for receipt:', fetchError);
      throw createError({
        statusCode: 404,
        statusMessage: 'Donation receipt not found or you do not have permission to view it.'
      });
    }

    // --- Generate PDF Receipt ---
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50 // Standard margins
    });
    
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    
    // Using a Promise to ensure the PDF generation is complete before sending
    const pdfPromise = new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      doc.on('error', (err) => {
        reject(err);
      });

      // --- PDF Content ---
      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Donation Receipt', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text('Jing Sun Welfare Society', { align: 'center' }); // Your organization name
      doc.text('123 Charity Lane, Kuala Lumpur, Malaysia', { align: 'center' }); // Your organization address
      doc.text('contact@jingsun.org | +60 12-345 6789', { align: 'center' }); // Your organization contact
      doc.moveDown(2);

      // Donation Details
      doc.fontSize(12).font('Helvetica-Bold').text('Donation Details:');
      doc.moveDown(0.5);
      doc.font('Helvetica').text(`Receipt #: ${donation.id.substring(0, 8).toUpperCase()}`); // Shortened ID for readability
      doc.text(`Date: ${new Date(donation.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
      doc.text(`Type: ${donation.type.charAt(0).toUpperCase() + donation.type.slice(1)}`);
      doc.text(`Category: ${donation.category.charAt(0).toUpperCase() + donation.category.slice(1)} Fund`);
      doc.text(`Transaction ID: ${donation.stripe_payment_intent_id || 'N/A'}`); // Display Stripe ID

      doc.moveDown(1);
      doc.font('Helvetica-Bold').fontSize(16).text('Amount Received:', { continued: true });
      doc.font('Helvetica').fontSize(16).text(` RM ${parseFloat(donation.amount).toFixed(2)} ${donation.currency.toUpperCase()}`);
      doc.moveDown(1);

      // Donor Information
      doc.fontSize(12).font('Helvetica-Bold').text('Donor Information:');
      doc.moveDown(0.5);
      doc.font('Helvetica').text(`Name: ${donation.profiles?.full_name || 'Anonymous Donor'}`);
      doc.text(`Email: ${donation.profiles?.email || 'N/A'}`);
      doc.moveDown(2);

      // Thank You Message
      doc.fontSize(12).font('Helvetica-Oblique').text('Thank you for your generous donation to Jing Sun Welfare Society!', { align: 'center' });
      doc.moveDown(0.5);
      doc.font('Helvetica').text('Your contribution helps us continue our mission and make a significant impact.', { align: 'center' });
      doc.moveDown(1);
      doc.text('This receipt serves as proof of your donation.', { align: 'center' });
      doc.text('Tax ID: PENDING-APPLICATION', { align: 'center' }); // **IMPORTANT: Replace with your actual tax ID**
      doc.moveDown(2);

      // Footer
      doc.fontSize(8).font('Helvetica-Light').text(`Generated on ${new Date().toLocaleString()} - Jing Sun Welfare Society`, { align: 'center' });

      // Finalize PDF
      doc.end();
    });

    // Wait for PDF to be generated
    const pdfBuffer = await pdfPromise;

    // --- Set Headers and Return PDF ---
    setHeader(event, 'Content-Type', 'application/pdf');
    // Set filename for download
    setHeader(event, 'Content-Disposition', `attachment; filename="donation-receipt-${donationId}.pdf"`);
    
    // Return the PDF buffer
    return pdfBuffer;

  } catch (error) {
    console.error('Receipt generation error:', error);
    // Use `H3Error` for custom errors in Nuxt server routes
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to generate receipt. Please try again later.'
    });
  }
});