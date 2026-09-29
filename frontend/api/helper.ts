const FN_ROUTE = "http://localhost:8000/teleporter/"

export function registerPlain<In, Out>(name: string) {
  if (import.meta.env.DEV) {
    console.log("REGISTERING duck_fn:" + name)
  }
  return async(incomingData: In): Promise<Out> => {
    const response = await fetch(FN_ROUTE + name, {
      method: "POST",
      body: JSON.stringify(incomingData)
    })
    if (import.meta.env.DEV) {
      if (response.status >= 500) {
        console.log(await response.text())
      }
    }
    return response.json() as Out
  } 
}

export function registerProducer<Out>(name: string) {
  if (import.meta.env.DEV) {
    console.log("REGISTERING duck_fn:" + name)
  }
  return async(): Promise<Out> => {
    const response = await fetch(FN_ROUTE + name, { method: "POST" })
    if (import.meta.env.DEV) {
      if (response.status >= 500) {
        console.log(await response.text())
      }
    }
    return response.json() as Out
  } 
}

export function registerConsumer<In>(name: string) {
  if (import.meta.env.DEV) {
    console.log("REGISTERING duck_fn:" + name)
  }
  return async(incomingData: In): Promise<void> => {
    const response = await fetch(FN_ROUTE + name, {
      method: "POST",
      body: JSON.stringify(incomingData)
    })

    if (import.meta.env.DEV) {
      if (response.status >= 500) {
        console.log(await response.text())
      }
    }
  } 
}

export function registerAction(name: string) {
  if (import.meta.env.DEV) {
    console.log("REGISTERING duck_fn:" + name)
  }
  return async(): Promise<void> => {
    const response = await fetch(FN_ROUTE + name, { method: "POST" })
    if (import.meta.env.DEV) {
      if (response.status >= 500) {
        console.log(await response.text())
      }
    }
  } 
}