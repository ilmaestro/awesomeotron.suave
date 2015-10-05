module Rest

open System
open System.Text
open Suave.Http
open Suave.Http.Applicatives
open Suave.Http.Successful
open Suave.Types
open Newtonsoft.Json
open Newtonsoft.Json.Serialization
open Newtonsoft.Json.Converters

type CustomDateTimeConverter() =
  inherit IsoDateTimeConverter()
  do base.DateTimeFormat <- "yyyy-MM-dd"

let converters : JsonConverter[] = [| CustomDateTimeConverter() |]

/// Convert the object to a JSON representation inside a byte array (can be made string of)
let to_json<'a> (o: 'a) =
  Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(o, converters))

/// Transform the byte array representing a JSON object to a .Net object
let from_json<'a> (bytes:byte []) =
  JsonConvert.DeserializeObject<'a>(Encoding.UTF8.GetString(bytes), converters)

/// Expose function f through a json call; lets you write like
///
/// let app =
///   url "/path" >>= request (map_json some_function);
///
let map_json f (r : Suave.Types.HttpRequest) =
  f (from_json(r.rawForm)) |> to_json |> Successful.ok
