export function applyTranslation(id: string, text: string) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = window.Asc.plugin.tr(text);
  }
}

export function getFullUrl(name: string): string {
  const location = window.location;
  const start = location.pathname.lastIndexOf("/") + 1;
  const file = location.pathname.slice(start);
  return location.href.replace(file, name);
}


export function callCommand<T>(
  func: () => T,
  isClose: boolean = false,
  isCalc: boolean = true,
): Promise<T> {
  return new Promise(resolve => {
    window.Asc.plugin.callCommand(func, isClose, isCalc, (res: T) => {
      resolve(res);
    })
  })
}

export function executeMethod(
  name: string,
  params: any[]
): Promise<any> {
  return new Promise(resolve => {
    window.Asc.plugin.executeMethod(name, params, (res: any) => {
      resolve(res);
    })
  })
}
