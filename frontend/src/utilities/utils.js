function toBoolean(x){
  if (typeof x == "string"){
    x = x.toLowerCase();
    return (x !== "false" && parseInt(x) !== 0);
  }
  return Boolean(x);
}

export { toBoolean }