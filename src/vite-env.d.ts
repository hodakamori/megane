/// <reference types="vite/client" />

// Vite worker imports
declare module "*?worker" {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}
