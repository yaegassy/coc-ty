import { commands, ExtensionContext, LanguageClient, ServiceStat } from 'coc.nvim';

export function register(context: ExtensionContext, client: LanguageClient) {
  context.subscriptions.push(
    commands.registerCommand('ty.restart', async () => {
      if (client) {
        if (client.serviceState !== ServiceStat.Stopped) {
          await client.stop();
        }
      }
      client.start();
    }),
  );
}
