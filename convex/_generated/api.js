const makeProxy = (path = []) => {
  const target = () => {};
  if (path.length > 0) {
    target._path = path.slice(0, -1).join('/') + ':' + path[path.length - 1];
  } else {
    target._path = "";
  }
  
  target.toString = function() {
    return this._path;
  };
  
  return new Proxy(target, {
    get(t, prop) {
      if (prop === '__esModule') return false;
      if (prop === 'then') return undefined;
      if (prop === '_path') return t._path;
      if (prop === 'toString') return t.toString;
      
      return makeProxy([...path, prop]);
    }
  });
};

const api = makeProxy([]);
module.exports = { api };
