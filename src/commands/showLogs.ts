import { commands, ExtensionContext, LanguageClient } from 'coc.nvim';

export async function register(context: ExtensionContext, client: LanguageClient) {
  await client.onReady();

  context.subscriptions.push(
    commands.registerCommand('ty.showLogs', () => {
      if (client.outputChannel) {
        client.outputChannel.show();
      }
    }),
  );
}
