import { supabase, supabaseConfigError } from './supabase';

function configError() {
  return new Error(supabaseConfigError || 'Supabase client is not available.');
}

/**
 * Fetch all projects ordered by newest first
 */
export async function getProjects() {
  if (!supabase) {
    return { data: null, error: configError() };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data || [], error: null };
  } catch (err) {
    console.error('Unexpected error fetching projects:', err);
    return { data: null, error: err };
  }
}

/**
 * Create a new project record
 */
export async function createProject(projectInput) {
  if (!supabase) {
    return { data: null, error: configError() };
  }

  try {
    const payload = {
      project_name: projectInput.project_name,
      project_url: projectInput.project_url,
      category: projectInput.category,
      username: projectInput.username || '',
      password: projectInput.password || '',
      admin_username: projectInput.admin_username || '',
      admin_password: projectInput.admin_password || '',
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error inserting project into Supabase:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating project:', err);
    return { data: null, error: err };
  }
}

/**
 * Update an existing project record
 */
export async function updateProject(id, updates) {
  if (!supabase) {
    return { data: null, error: configError() };
  }

  try {
    const payload = {
      project_name: updates.project_name,
      project_url: updates.project_url,
      category: updates.category,
      username: updates.username || '',
      password: updates.password || '',
      admin_username: updates.admin_username || '',
      admin_password: updates.admin_password || '',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project in Supabase:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating project:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete a project record by ID
 */
export async function deleteProject(id) {
  if (!supabase) {
    return { success: false, error: configError() };
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project from Supabase:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error deleting project:', err);
    return { success: false, error: err };
  }
}
