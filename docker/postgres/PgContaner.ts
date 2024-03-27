import { spawnSync } from 'node:child_process';
import path from 'path';

interface PgContainerOptions {
  port: number | string;
  migration: string;
  username: string;
  password: string;
  db: string;
  projectName: string;
}

export default class PgContainer {
  /** For reference */
  static defaultValues: Omit<PgContainerOptions, 'projectName'> = {
    port: 5000,
    migration: './sql',
    username: 'postgres',
    password: 'password',
    db: 'postgres',
  };

  static projectPrefix = 'next-chat-postgres-';

  port = PgContainer.defaultValues.port;

  migration = PgContainer.defaultValues.migration;

  username = PgContainer.defaultValues.username;

  password = PgContainer.defaultValues.password;

  db = PgContainer.defaultValues.db;

  projectName = Math.random().toString(16).slice(2);

  fullName: string;

  composeFile = path.resolve(__dirname, './compose.yaml');

  constructor(options: Partial<PgContainerOptions> = {}) {
    Object.assign(this, options);
    this.fullName = `${PgContainer.projectPrefix}${this.projectName}`;
  }

  _exec(command: string) {
    const composeEnv = {
      ...process.env,
      MIGRATION_PATH: path.resolve(process.cwd(), this.migration),
      PORT: `${this.port}`,
      USERNAME: this.username,
      PASSWORD: this.password,
      DB: this.db,
    };

    const compose = `compose -f ${this.composeFile} -p ${this.fullName}`;
    return spawnSync('docker', `${compose} ${command}`.split(' '), {
      env: composeEnv,
      stdio: 'inherit',
    });
  }

  start() {
    console.log(`Starting - ${this.fullName}`);
    return this._exec('up --build --wait');
  }

  end() {
    return this._exec('down -v --rmi local');
  }
}
