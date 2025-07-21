import { LanguageClient, LanguageClientOptions, ServerOptions, workspace } from 'coc.nvim';
import { SERVER_SUBCOMMAND } from './constant';

import which from 'which';

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

type ImportStrategy = 'fromEnvironment' | 'useBundled';

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';


type TyInitializationOptions = {
  settings: {
    path: string[];
    interpreter: string[];
    importStrategy: ImportStrategy;
    logLevel?: LogLevel;
    logFile?: string;
  };
};

function convertFromWorkspaceConfigToInitializationOptions() {
  const settings = workspace.getConfiguration('ty');

  const initializationOptions = <TyInitializationOptions>{
    settings: {
      path: settings.get<string[]>('path'),
      interpreter: settings.get('interpreter'),
      importStrategy: settings.get<ImportStrategy>(`importStrategy`) ?? 'fromEnvironment',
      logLevel: settings.get<LogLevel>('logLevel'),
      logFile: settings.get<string>('logFile'),
    },
  };

  return initializationOptions;
}

function getInitializationOptions() {
  const initializationOptions = convertFromWorkspaceConfigToInitializationOptions();

  // MEMO: Custom Feature
  if (workspace.getConfiguration('ty').get<boolean>('useDetectTyCommand', true)) {
    const envTyCommandPath = which.sync('ty', { nothrow: true });
    if (envTyCommandPath) {
      initializationOptions.settings.path = [envTyCommandPath];
    }
  }

  return initializationOptions;
}

function getLanguageClientDisabledFeatures() {
  const r: string[] = [];

  // **REF**: disabledFeatures
  // `:h coc-config-languageserver`
  if (getConfigDisableHover()) r.push('hover');
  if (getConfigDisableInlayHintHover()) r.push('inlayHint');
  if (getConfigDisableTypeDefinition()) r.push('typeDefinition');
  if (getConfigDisableDiagnostics()) {
    r.push('diagnostics');
    r.push('pullDiagnostic');
  }

  return r;
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

function getConfigDisableDiagnostics() {
  return workspace.getConfiguration('ty').get<boolean>('disableDiagnostics', false);
}
