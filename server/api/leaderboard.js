// /api/leaderboard.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const period = query.period || 'all'
    const type = query.type || 'all'

    // Get user from auth for permission checking
    const authHeader = getHeader(event, 'authorization')
    let user = null
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user: authUser } } = await supabase.auth.getUser(token)
      user = authUser
    }

    // Check if user can view full details (staff/admin)
    let canViewFullDetails = false
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      canViewFullDetails = profile?.role === 'staff' || profile?.role === 'admin'
    }

    // Build date filter based on period
    let dateFilter = ''
    const now = new Date()
    
    switch (period) {
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        dateFilter = `and created_at >= '${startOfMonth.toISOString()}'`
        break
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3)
        const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1)
        dateFilter = `and created_at >= '${startOfQuarter.toISOString()}'`
        break
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        dateFilter = `and created_at >= '${startOfYear.toISOString()}'`
        break
      default:
        dateFilter = ''
    }

    // Build type filter
    let typeFilter = ''
    switch (type) {
      case 'monetary':
        typeFilter = `and type != 'physical'`
        break
      case 'physical':
        typeFilter = `and type = 'physical'`
        break
      default:
        typeFilter = ''
    }

    // Build the aggregation query
    const { data: leaderboardData, error: leaderboardError } = await supabase.rpc('get_donor_leaderboard', {
      date_filter: dateFilter,
      type_filter: typeFilter,
      show_full_details: canViewFullDetails
    })

    if (leaderboardError) {
      console.error('Leaderboard query error:', leaderboardError)
      throw new Error('Failed to fetch leaderboard data')
    }

    // Calculate stats
    const stats = {
      totalDonors: leaderboardData.length,
      totalAmount: leaderboardData.reduce((sum, donor) => sum + donor.total_amount, 0),
      averageDonation: 0
    }

    if (stats.totalDonors > 0) {
      const totalDonations = leaderboardData.reduce((sum, donor) => sum + donor.donation_count, 0)
      stats.averageDonation = stats.totalAmount / totalDonations
    }

    return {
      success: true,
      leaderboard: leaderboardData,
      stats,
      canViewFullDetails
    }

  } catch (error) {
    console.error('Leaderboard API error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch leaderboard data',
      leaderboard: [],
      stats: {
        totalDonors: 0,
        totalAmount: 0,
        averageDonation: 0
      }
    }
  }
})