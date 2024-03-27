import PgContainer from '@/docker/postgres/PgContaner';
import nodeCleanup from 'node-cleanup';
import { spawn } from 'child_process';

const container = new PgContainer();

const pgEnv = {
  PGPASSWORD: container.password,
  PGUSER: container.username,
  PGPORT: container.port,
  PGHOST: '0.0.0.0',
  PGDATABASE: container.db,
};

Object.assign(process.env, pgEnv);

container.start();

const nextJS = spawn('yarn dev', { shell: true, stdio: 'inherit' });

nodeCleanup(() => {
  nextJS.kill();
  container.end();
});
