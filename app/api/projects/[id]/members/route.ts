import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const addMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const removeMemberSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a member of the project
    const { data: membership } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get all project members with profile data
    const { data: members, error } = await supabase
      .from('project_members')
      .select(`
        id,
        role,
        joined_at,
        user_id,
        profiles(full_name, email, avatar_url)
      `)
      .eq('project_id', id)
      .order('joined_at', { ascending: true })

    if (error) {
      console.error('Error fetching members:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(members)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or global admin
    const { isGlobalAdmin } = await import('@/lib/auth')
    const globalAdmin = await isGlobalAdmin(user.id)

    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .single()

    if (!globalAdmin && (!membership || membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = addMemberSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 422 }
      )
    }

    // Look up user by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', validation.data.email)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'No account found with this email. Please ask them to sign up first.' },
        { status: 404 }
      )
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', id)
      .eq('user_id', profile.id)
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this project' },
        { status: 400 }
      )
    }

    // Add member
    const { data: newMember, error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id: id,
        user_id: profile.id,
        role: 'member',
      })
      .select(`
        id,
        role,
        joined_at,
        user_id,
        profiles(full_name, email, avatar_url)
      `)
      .single()

    if (memberError) {
      console.error('Error adding member:', memberError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or global admin
    const { isGlobalAdmin } = await import('@/lib/auth')
    const globalAdmin = await isGlobalAdmin(user.id)

    const { data: membership } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .single()

    if (!globalAdmin && (!membership || membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = removeMemberSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 422 }
      )
    }

    // Check if this is the last admin
    const { data: admins } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', id)
      .eq('role', 'admin')

    if (admins && admins.length === 1 && validation.data.user_id === user.id) {
      return NextResponse.json(
        { error: 'You must assign another Admin before leaving this project' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', id)
      .eq('user_id', validation.data.user_id)

    if (error) {
      console.error('Error removing member:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
