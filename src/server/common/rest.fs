namespace AwesomeOTron

type RestResource<'a> = {
  GetAll : unit -> 'a seq
  Create : 'a -> 'a
}

[<AutoOpen>]
module Rest =

  open System
  open Suave.Http
  open Suave.Http.Applicatives
  open Suave.Http.Successful
  open Suave.Types
  open Newtonsoft.Json
  open Newtonsoft.Json.Serialization


  type ryan = {
    bork: string
  }

  let rk () =
    [
    {bork = "hellllo bork 1"}
    {bork = "hellllo bork 2"} ]
    |> Seq.map (fun p -> p)


  let JSON v =
    let jsonSerializerSettings = new JsonSerializerSettings()
    jsonSerializerSettings.ContractResolver <- new CamelCasePropertyNamesContractResolver()
    JsonConvert.SerializeObject(v, jsonSerializerSettings)
    |> OK
    >>= Writers.setMimeType "application/json; charset=utf-8"

  let fromJSON<'a> json =
    JsonConvert.DeserializeObject(json, typeof<'a>) :?> 'a

  let getResourceFromReq<'a> (req : HttpRequest) =
    let getRawString rawForm = System.Text.Encoding.UTF8.GetString(rawForm)
    req.rawForm |> getRawString |> fromJSON<'a>

  let rest resourceName resource =
    let resourcePath = "/" + resourceName
    path resourcePath
      >>= choose [
        GET >>= (resource.GetAll() |> JSON)
        POST >>= request (getResourceFromReq >> resource.Create >> JSON)
        ]


  let jsonTest () = [fromJSON<ryan> "{'bork': 'test'}"] |> Seq.map(fun p -> p)

  let peopleWebpart = rest "people" {
      GetAll = jsonTest //rk
      Create = (fun r -> r)
  }
