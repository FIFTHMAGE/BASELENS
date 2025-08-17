import { createClient } from '@supabase/supabase-js'

const url = process.env.REACT_APP_SUPABASE_URL
const key = process.env.REACT_APP_SUPABASE_KEY

// Enhanced debug logging
console.log('=== Supabase Client Debug ===')
console.log('Environment variables check:')
console.log('REACT_APP_SUPABASE_URL:', url ? `✅ Loaded: ${url.substring(0, 20)}...` : '❌ Missing')
console.log('REACT_APP_SUPABASE_KEY:', key ? `✅ Loaded: ${key.substring(0, 20)}...` : '❌ Missing')
console.log('process.env keys:', Object.keys(process.env).filter(key => key.includes('SUPABASE')))
console.log('================================')

// Validate environment variables
if (!url) {
  console.error('REACT_APP_SUPABASE_URL is not defined in environment variables')
}
if (!key) {
  console.error('REACT_APP_SUPABASE_KEY is not defined in environment variables')
}

// Only create client if both URL and key are available
export const supabase = url && key ? createClient(url, key) : null

if (supabase) {
  console.log('✅ Supabase client initialized successfully')
  // Test the connection
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error)
    } else {
      console.log('✅ Supabase connection test successful')
    }
  })
} else {
  console.log('❌ Supabase client failed to initialize')
}

export async function upsertUser(wallet_address) {
  if (!supabase) {
    console.error('Supabase client not initialized - check environment variables')
    return null
  }
  
  try {
    // First try to get existing user
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', wallet_address)
      .single()
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing user:', selectError)
      return null
    }
    
    if (existingUser) {
      console.log('User already exists:', existingUser)
      return existingUser
    }
    
    // Insert new user if doesn't exist
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ wallet_address }])
      .select()
      .single()
    
    if (insertError) {
      console.error('Error inserting new user:', insertError)
      return null
    }
    
    console.log('New user created:', newUser)
    return newUser
    
  } catch (error) {
    console.error('Upsert user error:', error)
    return null
  }
}

export async function addTrackedWallet(user_id, tracked_wallet) {
  if (!supabase) {
    console.error('Supabase client not initialized - check environment variables')
    return null
  }
  
  console.log('=== Adding Tracked Wallet Debug ===')
  console.log('User ID:', user_id)
  console.log('Tracked Wallet:', tracked_wallet)
  
  const { data, error } = await supabase
    .from('tracked_wallets')
    .insert([{ 
      user_id, 
      tracked_wallet,
      wallet_address: tracked_wallet  // Try both columns
    }])
    .select()
  
  if (error) {
    console.error('Error adding tracked wallet:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })
    
    // Log the full error object for debugging
    console.error('Full error object:', JSON.stringify(error, null, 2))
    return null
  }
  
  console.log('Successfully added tracked wallet:', data)
  return data
}

export async function getTrackedWallets(user_id) {
  if (!supabase) {
    console.error('Supabase client not initialized - check environment variables')
    return []
  }
  
  const { data, error } = await supabase
    .from('tracked_wallets')
    .select('*')
    .eq('user_id', user_id)
    // Remove the order by created_at for now since it's causing issues
  if (error) {
    console.error('Error getting tracked wallets:', error)
    return []
  }
  return data || []
}

// Add this function to test the database schema
export async function testDatabaseSchema() {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return
  }
  
  try {
    // Test users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (usersError) {
      console.error('Users table error:', usersError)
    } else {
      console.log('Users table columns:', Object.keys(usersData[0] || {}))
      console.log('Users table sample data:', usersData[0])
    }
    
    // Test tracked_wallets table
    const { data: trackedData, error: trackedError } = await supabase
      .from('tracked_wallets')
      .select('*')
      .limit(1)
    
    if (trackedError) {
      console.error('Tracked wallets table error:', trackedError)
      console.error('Error details:', {
        code: trackedError.code,
        message: trackedError.message,
        details: trackedError.details,
        hint: trackedError.hint
      })
    } else {
      console.log('Tracked wallets table columns:', Object.keys(trackedData[0] || {}))
      console.log('Tracked wallets table sample data:', trackedData[0])
    }
    
    // Test if we can insert a simple record to see what happens
    console.log('Testing simple insert...')
    const { data: testInsert, error: testError } = await supabase
      .from('tracked_wallets')
      .insert([{ 
        user_id: 'test', 
        tracked_wallet: 'test',
        wallet_address: 'test'  // Try both columns
      }])
      .select()
    
    if (testError) {
      console.error('Test insert error:', testError)
      console.error('Test insert error details:', {
        code: testError.code,
        message: testError.message,
        details: testError.details,
        hint: testError.hint
      })
    } else {
      console.log('Test insert successful:', testInsert)
      // Clean up test data
      await supabase.from('tracked_wallets').delete().eq('user_id', 'test')
    }
    
  } catch (error) {
    console.error('Schema test error:', error)
  }
}
