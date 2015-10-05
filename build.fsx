#nowarn "40"
#I "packages/FAKE/tools"
#I "packages/Suave/lib/net40"
#I "packages/Suave.DotLiquid/lib/net40/"
#I "packages/DotLiquid/lib/NET45"
#I "packages/FsPickler/lib/net45"
#I "packages/FsPickler.Json/lib/net45"
#r "FakeLib.dll"
#r "Suave.dll"
#r "DotLiquid.dll"
#r "Suave.DotLiquid.dll"
#r "FsPickler.dll"
#r "Newtonsoft.Json.dll"
#r "FsPickler.Json.dll"
open Suave                 // always open suave
open Fake
open System
open System.IO
open Suave.Web
open Suave.Http
open Suave.Http.Applicatives
open Suave.Http.Successful
open Suave.Http.Files
open Suave.Http.Writers
open Suave.Types
open Nessos.FsPickler
open Nessos.FsPickler.Json
open Nessos.FsPickler.Combinators

#load "src/server/common/utils.fs"
#load "src/server/common/rest.fs"
#load "src/server/common/db.fs"
open AwesomeOTron
open AwesomeOTron.Utils

// -------------------------------------------------------------------------------------------------
// Server entry-point and routing
// -------------------------------------------------------------------------------------------------

let browseStaticFile file (ctx : Types.HttpContext) = async {
  let actualFile = Path.Combine(ctx.runtime.homeDirectory, "web", file)
  let mime = Suave.Http.Writers.defaultMimeTypesMap(Path.GetExtension(actualFile))
  let setMime =
    match mime with
    | None -> fun c -> async { return None }
    | Some mime -> Suave.Http.Writers.setMimeType mime.name
  return! ctx |> ( setMime >>= Successful.ok(File.ReadAllBytes actualFile) ) }

let browseStaticFiles (ctx : Types.HttpContext) = async {
  let local = ctx.request.url.LocalPath
  let file = if local = "/" then "index.html" else local.Substring(1)
  return! browseStaticFile file ctx }

// Configure DotLiquid templates & register filters (in 'filters.fs')
//[ for t in System.Reflection.Assembly.GetExecutingAssembly().GetTypes() do
//    if t.Name = "Filters" && not (t.FullName.StartsWith "<") then yield t ]
//|> Seq.last
//|> DotLiquid.registerFiltersByType

DotLiquid.setTemplatesDir (__SOURCE_DIRECTORY__ + "/src/server/templates")

type ryan = {
  bork: string
}

let rk =
  [
  {bork = "hellllo bork 1"}
  {bork = "hellllo bork 2"} ]
  |> Seq.map (fun p -> p)

let serverWebpart = path "/" >>= delay (fun () ->
    DotLiquid.page "home.html" ())

let peopleWebpart =
  choose [
    GET >>= path "/api/people" >>= delay (fun () ->
        Rest.to_json Db.getPeople |> Successful.ok)
    POST >>= path "/api/people" >>= request (Rest.map_json Db.createPerson)
  ]


let startWebServer port =
    let defaultBinding = defaultConfig.bindings.[0]
    let withPort = { defaultBinding.socketBinding with port = uint16 port }
    let mimeTypes =
      defaultMimeTypesMap
        >=> (function | ".avi" -> mkMimeType "video/avi" false | _ -> None)
    let serverConfig =
        { defaultConfig with
            bindings = [ { defaultBinding with socketBinding = withPort } ]
            homeFolder = Some __SOURCE_DIRECTORY__ }
    let app =
        Writers.setHeader "Cache-Control" "no-cache, no-store, must-revalidate"
        >>= Writers.setHeader "Pragma" "no-cache"
        >>= Writers.setHeader "Expires" "0"
        >>= choose
          [ serverWebpart
            //Rest.peopleWebpart
            peopleWebpart
            browseStaticFiles]
    startWebServerAsync serverConfig app |> snd |> Async.RunSynchronously

Target "AutoStart" (fun _ ->
    startWebServer (int (getBuildParam "port"))
)

Target "Run" (fun _ ->
    startWebServer 8015
    Diagnostics.Process.Start "http://localhost:8015" |> ignore
)

RunTargetOrDefault "Run"
