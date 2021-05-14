export const getModel = (defaultConfig) => {
  let model = 'tabs';
  if (defaultConfig === 'SPA') {
    model = 'spa';
  } else if (defaultConfig === 'MultiTab') {
    model = 'tabs';
  } else if (defaultConfig === 'BrowserTab') {
    model = 'btab';
  }
  return model;
};

export const getFilterActionsType = () => {
  return ['datascope', 'action'];
};
