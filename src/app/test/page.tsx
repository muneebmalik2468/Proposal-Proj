'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log(data, error);
    };

    test();
  }, []);

  return <div>Supabase Connected ✅</div>;
}