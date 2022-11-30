import {Game} from "../models/class/Game";

export class FileAdapter {

  public static saveGameToJsonFile(game: Game): void {
    this.download(JSON.stringify(game), 'game.json', 'text/plain');
  }

  private static download(content: any, fileName: string, contentType: string) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  public static async handleFileInput(e: Event): Promise<Game> {
    const file: File | null | undefined = (e.target as HTMLInputElement).files?.item(0);

    if (!file) {
      throw new Error("No file input!");
    }

    const game = JSON.parse(await file.text());
    console.log("Parsed object:", game);

    return game as Game;
  }

}
