import { arrayify, hexlify, isBytesLike } from 'https://esm.sh/ethers@5.7.2/lib/utils';
import { inflate } from 'https://deno.land/x/compress@v0.4.5/zlib/mod.ts';
import { v5 as uuidv5 } from 'https://esm.sh/uuid@9.0.0';
import cbor from 'https://esm.sh/v111/cbor@8.1.0/es2022/cbor.js';

import { createClient as createDbClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12';
import { createClient as createSgClient } from 'https://esm.sh/v111/@urql/core@3.2.0/es2022/core.js';

export { arrayify, isBytesLike, hexlify, inflate, uuidv5, cbor, createDbClient, createSgClient };
