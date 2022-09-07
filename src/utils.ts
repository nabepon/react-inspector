declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
    __REACT_DEVTOOLS_TARGET_WINDOW__: any;
  }
}

interface DebugSource {
  columnNumber: number;
  fileName: string;
  lineNumber: number;
}

// TODO Refactoring needed ref react/packages/react-devtools-shared/src/backend/agent.js getBestMatchingRendererInterface
export const checkDevtoolsGlobalHook = (): boolean =>
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.size > 0 &&
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);

// TODO Refactoring needed ref react/packages/react-devtools-shared/src/backend/agent.js getBestMatchingRendererInterface
export const getDevtoolsGlobalHookRenderer = () => {
  if (!checkDevtoolsGlobalHook()) return null;
  return window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
};

export const getVsCodeLink = (sourceCode: DebugSource) =>
  `vscode://file${sourceCode.fileName}:${sourceCode.lineNumber}:${sourceCode.columnNumber}`;

export const getCodePath = (sourceCode: DebugSource) =>
  `${sourceCode.fileName}:${sourceCode.lineNumber}:${sourceCode.columnNumber}`;

export const getIntellijCodeLink = (sourceCode: DebugSource) =>
  `idea://open?file=${sourceCode.fileName}&line=${sourceCode.lineNumber}&column=${sourceCode.columnNumber}`;

export const findFiberByHostInstance = (
  target: HTMLElement
): { _debugSource: DebugSource } | null => {
  if (!checkDevtoolsGlobalHook()) return null;

  const renderer = getDevtoolsGlobalHookRenderer();
  if (!renderer) return null;

  const fiber = findFiber(renderer.findFiberByHostInstance(target)) || null;

  return fiber && fiber._debugSource ? fiber : null;
};

export {};

const findFiber = (fiber?: any): any => {
  if (fiber?._debugSource === null) {
    return findFiber(fiber._debugOwner);
  }
  if (fiber?._debugSource) {
    return fiber;
  }
  return null;
}