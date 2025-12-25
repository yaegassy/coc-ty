import {
  ConfigurationWorkspaceMiddleware,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  workspace,
} from 'coc.nvim';
import { SERVER_SUBCOMMAND } from './constant';

// Keys that are handled by the extension and should not be sent to the server
const EXTENSION_ONLY_KEYS: Record<string, true> = {
  // InitializationOptions
  logLevel: true,
  logFile: true,
  // ExtensionSettings by coc-ty
  enable: true,
  disableCompletion: true,
  disableDiagnostics: true,
  disableHover: true,
  disableInlayHint: true,
  disableTypeDefinition: true,
  path: true,
  interpreter: true,
  importStrategy: true,
  trace: true,
};

function isExtensionOnlyKey(key: string): boolean {
  return key in EXTENSION_ONLY_KEYS;
}

const configurationWorkspaceMiddleware: ConfigurationWorkspaceMiddleware = {
  configuration: async (params, token, next) => {
    const response = await next(params, token);

    if (!Array.isArray(response)) {
      return response;
    }

    return params.items.map((param, index) => {
      const result = response[index];

      if (param.section === 'ty' && result && typeof result === 'object') {
        // Filter out extension-only settings that shouldn't be sent to the server
        const serverSettings = Object.fromEntries(Object.entries(result).filter(([key]) => !isExtensionOnlyKey(key)));
        return serverSettings;
      }

      return result;
    });
  },
};

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
    middleware: {
      workspace: configurationWorkspaceMiddleware,
    },
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
