export abstract class Emphasis {
  static bolden(text: string): string {
    return `**${text}**`;
  }

  static italicize(text: string): string {
    return `_${text}_`;
  }

  static strikeThrough(text: string): string {
    return `~~${text}~~`;
  }
}
