import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function trackVisitor(data: {
  name?: string;
  role?: string;
  company?: string;
  token?: string;
  skipped: boolean;
}) {
  try {
    const { error } = await supabase
      .from('visitors')
      .insert([{
        name:       data.name     || null,
        role:       data.role     || null,
        company:    data.company  || null,
        token:      data.token    || null,
        skipped:    data.skipped,
        visited_at: new Date().toISOString(),
      }]);

    if (error) console.error('Supabase insert error:', error);
    else        console.log('✅ Visitor tracked in Supabase');
  } catch (e) {
    console.error('Supabase error:', e);
  }
}