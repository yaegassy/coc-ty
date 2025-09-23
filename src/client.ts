import { LanguageClient, LanguageClientOptions, ServerOptions, workspace } from 'coc.nvim';
import { SERVER_SUBCOMMAND } from './constant';

export function createServerClient(command: string) {
  const newEnv = { ...process.env };
  const args = [SERVER_SUBCOMMAND];

  const serverOptions: ServerOptions = {
    command,
    args,
    options: { env: newEnv },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['python'],
    initializationOptions: getInitializationOptions(),
    disabledFeatures: getLanguageClientDisabledFeatures(),
  };

  const client = new LanguageClient('ty', 'ty server', serverOptions, clientOptions);
  return client;
}

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

type TyInitializationOptions = {
  logLevel?: LogLevel;
  logFile?: string;
};

function convertFromWorkspaceConfigToInitializationOptions() {
  const settings = workspace.getConfiguration('ty');

  const initializationOptions = <TyInitializationOptions>{
    logLevel: settings.get<LogLevel>('logLevel'),
    logFile: settings.get<string>('logFile'),
  };

  return initializationOptions;
}

function getInitializationOptions() {
  const initializationOptions = convertFromWorkspaceConfigToInitializationOptions();
  return initializationOptions;
}

function getLanguageClientDisabledFeatures() {
  const r: string[] = [];

  // **REF**: disabledFeatures
  // `h: coc-config.txt`
  if (getConfigDisableCompletion()) r.push('completion');
  if (getConfigDisableHover()) r.push('hover');
  if (getConfigDisableInlayHintHover()) r.push('inlayHint');
  if (getConfigDisableTypeDefinition()) r.push('typeDefinition');
  if (getConfigDisableDiagnostics()) {
    r.push('diagnostics');
    r.push('pullDiagnostic');
  }

  return r;
}

function getConfigDisableCompletion() {
  return workspace.getConfiguration('ty').get<boolean>('disableCompletion', false);
}

function getConfigDisableDiagnostics() {
  return workspace.getConfiguration('ty').get<boolean>('disableDiagnostics', false);
}

function getConfigDisableHover() {
  return workspace.getConfiguration('ty').get<boolean>('disableHover', false);
}

function getConfigDisableInlayHintHover() {
  return workspace.getConfiguration('ty').get<boolean>('disableInlayHint', false);
}

function getConfigDisableTypeDefinition() {
  return workspace.getConfiguration('ty').get<boolean>('disableTypeDefinition', false);
}
