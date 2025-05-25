import { ExtensionContext, LanguageClient, services, window, workspace } from 'coc.nvim';

import { createServerClient } from './client';
import * as restartCommandFeature from './commands/restart';
import * as showLogsCommandFeature from './commands/showLogs';
import { getTyBinaryPath } from './tool';

let client: LanguageClient | undefined;

export async function activate(context: ExtensionContext): Promise<void> {
  if (!workspace.getConfiguration('ty').get('enable')) return;

  const command = await getTyBinaryPath();
  if (command) {
    client = createServerClient(command);
  } else {
    window.showWarningMessage('coc-ty | "ty" binary does not exist.`');
    return;
  }

  context.subscriptions.push(services.registLanguageClient(client));

  showLogsCommandFeature.register(context, client);
  restartCommandFeature.register(context, client);
}
