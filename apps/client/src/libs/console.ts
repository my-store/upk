export function Log(text: string): void {
  const style = `
        color: white;
        background-color: green;
    `;
  console.log(`%c ${text} `, style);
}

export function Error(text: string): void {
  const style = `
        color: white;
        background-color: red;
    `;
  console.log(`%c ${text} `, style);
}

export function Warn(text: string): void {
  const style = `
        color: black;
        background-color: yellow;
    `;
  console.log(`%c ${text} `, style);
}
