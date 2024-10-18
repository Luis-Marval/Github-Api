const userName = process.argv[2]
let action;
if(userName === undefined){
  console.log("Se debe ingresar el nombre de usuario de githud");
  process.exit(1)
}

try {
  const api = await fetch(`https://api.github.com/users/${userName}/events`)
  const resApi = api.ok ? api.json() : Promise.reject(api)
  const res = await resApi;
  let i = 0;

  console.clear()
  console.log(`Nombre de usuario: ${userName}\n`)

  if (res.length === 0) {
    console.log("No Hay actividad reciente");
  }

  res.forEach(res => {
    let date =  new Date(res["created_at"])
    date= date.getHours()+":"+ date.getMinutes() +":"+ date.getSeconds()+" "+ date.getDate()+"/"+ (date.getMonth()+1) +"/"+ date.getFullYear()
    typeEvent(res)
    console.log(`  Fecha:${date}\n`)
  });
} catch (err) {
  if(err.status === 404) {
    console.error("No se ha encontrado el usuario seleccionado")
    process.exit(1)
  }  
  console.error("ha habido un fallo en la conexion")
  process.exit(1)
}


function typeEvent(res){
  switch(res["type"]){
    case "PushEvent":
      console.log(`- Realizado ${res["payload"]["size"]} commits para ${res.repo.name}`)
      break
    case "PublicEvent":
        console.log(`- Se ha cambiado el repositorio ${res.repo.name} a publico`)
    break
    case "CreateEvent":
        console.log(`- Creado un nuevo ${res["payload"]["ref_type"]} ${res.repo.name}`)
    break
    case "DeleteEvent":
      console.log(`- ${res["payload"]["ref_type"]} Eiminado`)
    break
    case "ForkEvent":
      console.log(`- Se ha realizado un fork al repositorio ${res.repo.name}`)
    break
    case "GollumEvent":
      action = res["payload"]["pages"][0]["action"] === "created" ? "creado": "editado"
      console.log(`- Se ha ${action} la wiki del repositorio ${res.repo.name}}`)
    break
    case "IssueCommentEvent":
      if(res["payload"]["action"] === "created")action = "Creado"
      if(res["payload"]["action"] === "edited")action = "Editado"
      if(res["payload"]["action"] === "deleted")action = "Eliminado"
      console.log(`- Se ha ${action} un comentario del repositorio ${res.repo.name}}`)
    break
    case "PullRequestEvent":
      console.log(`- ${res["payload"]["pull_request"]}`)
    break
    case "WatchEvent":
      console.log(`-Protagonizando el repositorio ${res.repo.name}`)
    break
  }
}
