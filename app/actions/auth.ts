'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function provisionUser(formData: {
  email: string;
  password?: string;
  fullName: string;
  roleId: string;
}) {
  try {
    // 1. Create the user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password || 'VisionAstraa123!',
      email_confirm: true,
      user_metadata: {
        full_name: formData.fullName
      }
    });

    if (authError) throw authError;

    // 2. Assign the role in public.user_roles
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role_id: formData.roleId
      });

    if (roleError) throw roleError;

    // 3. Profiles table is handled by the DB trigger
    
    revalidatePath('/users');
    return { success: true };
  } catch (error: any) {
    console.error('Provisioning Error:', error);
    return { success: false, error: error.message };
  }
}
