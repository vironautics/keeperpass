function matches(value: string, confirmation: string): boolean {
  return value.length > 0 && value === confirmation;
}

export { matches };
