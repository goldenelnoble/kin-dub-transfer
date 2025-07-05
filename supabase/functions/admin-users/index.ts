import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Admin Users function up and running!")

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { method } = req
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    console.log(`Method: ${method}, Action: ${action}`)

    switch (method) {
      case 'GET':
        if (action === 'list') {
          console.log('Listing users...')
          
          // Get all user profiles with auth user data
          const { data: profiles, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false })

          if (profileError) {
            console.error('Error fetching profiles:', profileError)
            return new Response(JSON.stringify({ 
              error: 'Erreur lors de la récupération des profils utilisateurs'
            }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // Get auth users data
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
          
          if (authError) {
            console.error('Error fetching auth users:', authError)
            return new Response(JSON.stringify({ 
              error: 'Erreur lors de la récupération des utilisateurs auth'
            }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // Combine profile and auth data
          const users = profiles.map(profile => {
            const authUser = authData.users.find(u => u.id === profile.id)
            return {
              id: profile.id,
              name: profile.name,
              email: authUser?.email || '',
              role: profile.role,
              createdAt: profile.created_at,
              lastLogin: profile.last_login,
              isActive: profile.is_active,
              identifier: profile.identifier
            }
          })

          console.log(`Successfully listed ${users.length} users`)
          return new Response(JSON.stringify({ users }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        return new Response(JSON.stringify({ 
          error: 'Action non supportée pour GET' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'POST':
        const userData = await req.json()
        
        if (userData.action === 'create') {
          console.log('Creating new user...')
          console.log('User data received:', { ...userData, password: '[REDACTED]' })

          // Validate required fields
          if (!userData.email || !userData.password || !userData.name) {
            return new Response(JSON.stringify({ 
              error: 'Email, mot de passe et nom sont requis' 
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // Create user in Supabase Auth
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            user_metadata: { name: userData.name }
          })

          if (authError || !authData.user) {
            console.error('Error creating auth user:', authError)
            return new Response(JSON.stringify({ 
              error: authError?.message || 'Erreur lors de la création de l\'utilisateur'
            }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          console.log('Auth user created successfully:', authData.user.id)

          // Update the profile with the specified role
          const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .update({
              name: userData.name,
              role: userData.role,
              is_active: userData.isActive,
              identifier: userData.identifier
            })
            .eq('id', authData.user.id)

          if (profileError) {
            console.error('Error updating user profile:', profileError)
            return new Response(JSON.stringify({ 
              error: 'Erreur lors de la mise à jour du profil utilisateur'
            }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          console.log('User profile updated successfully')

          return new Response(JSON.stringify({ 
            success: true, 
            user: {
              id: authData.user.id,
              email: authData.user.email,
              name: userData.name,
              role: userData.role
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        return new Response(JSON.stringify({ 
          error: 'Action non supportée pour POST' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'PUT':
        const updateData = await req.json()
        
        if (updateData.action === 'update') {
          console.log('Updating user...')
          
          const { userId, ...userData } = updateData
          console.log('Updating user:', userId, userData)

          if (!userId) {
            return new Response(JSON.stringify({ 
              error: 'ID utilisateur requis' 
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // Update user profile
          const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .update({
              name: userData.name,
              role: userData.role,
              is_active: userData.isActive,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (profileError) {
            console.error('Error updating user profile:', profileError)
            return new Response(JSON.stringify({ 
              error: 'Erreur lors de la mise à jour du profil utilisateur'
            }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          console.log('User updated successfully')

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        return new Response(JSON.stringify({ 
          error: 'Action non supportée pour PUT' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'DELETE':
        const deleteData = await req.json()
        
        if (deleteData.action === 'delete') {
          console.log('Deleting user...')
          
          const { userId } = deleteData
          console.log('Deleting user:', userId)

          if (!userId) {
            return new Response(JSON.stringify({ 
              error: 'ID utilisateur requis' 
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // Delete user from auth (this will cascade to profile due to foreign key)
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

          if (deleteError) {
            console.error('Error deleting user:', deleteError)
            return new Response(JSON.stringify({ 
              error: 'Erreur lors de la suppression de l\'utilisateur'
            }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          console.log('User deleted successfully')

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        return new Response(JSON.stringify({ 
          error: 'Action non supportée pour DELETE' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ 
          error: 'Méthode HTTP non autorisée' 
        }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    console.error('Error in admin-users function:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Une erreur est survenue lors de l\'opération'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})