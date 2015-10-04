module AwesomeOTron.Utils

open System
open Suave.Http.Applicatives

/// Creates a web part from a function (to enable lazy computation)
let delay (f:unit -> Suave.Types.WebPart) ctx =
  async { return! f () ctx }
