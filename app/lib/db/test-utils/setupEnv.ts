import PgContainer from "@/docker/postgres/PgContaner";
import { beforeAll, afterAll} from 'vitest';

const container = new PgContainer({port: '1223', projectName: 'pg-tests'});

Object.assign(process.env, {
  PGHOST: '0.0.0.0',
  PGPASSWORD: container.password,
  PGUSER: container.username,
  PGDATABASE: container.db,
  PGPORT: container.port
});

beforeAll(() => {
  container.start();
})

afterAll(() => {
  container.end();
})
