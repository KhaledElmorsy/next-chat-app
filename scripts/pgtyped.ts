import PgContainer from '@/docker/postgres/PgContaner';
import nodeCleanup from 'node-cleanup';
import { spawn } from 'child_process';

const container = new PgContainer({ port: 6887, projectName: 'pgtyped' });

const pgEnv = {
  PGPASSWORD: container.password,
  PGUSER: container.username,
  PGPORT: container.port,
  PGHOST: '0.0.0.0',
  PGDATABASE: container.db,
};

Object.assign(process.env, pgEnv);

container.start();

const pgTyped = spawn('npx pgtyped -w -c pgtyped.config.json', {
  shell: true,
  stdio: 'inherit',
});

nodeCleanup(() => {
  pgTyped.kill();
  container.end();
});
