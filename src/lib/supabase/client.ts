// Cliente no-op para reemplazar Supabase y evitar la dependencia en el frontend.
// Provee la mínima API usada por la app y devuelve valores seguros.

type SupabaseResult = { data: any; error: any };

function builder() {
  const obj: any = {};
  const chainable = [
    'select', 'eq', 'order', 'limit', 'single', 'maybeSingle', 'insert', 'update', 'delete', 'match', 'range'
  ];
  chainable.forEach((k) => {
    obj[k] = () => obj;
  });
  obj.then = (resolve: any) => {
    const res: SupabaseResult = { data: null, error: null };
    resolve(res);
    return Promise.resolve(res);
  };
  obj.catch = () => obj;
  return obj;
}

const safeClient = {
  from: (_: string) => builder(),
  rpc: async () => ({ data: null, error: null }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signIn: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
} as any;

export default safeClient;
