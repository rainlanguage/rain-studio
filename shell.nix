let
  pkgs = import
    (builtins.fetchTarball {
      name = "nixos-unstable-2023-02-21";
      url = "https://github.com/nixos/nixpkgs/archive/b69883faca9542d135fa6bab7928ff1b233c167f.tar.gz";
      sha256 = "sha256:1r846d1fb7qgqrnnkjss9r4idm9gnmh9qfvj751gfkjz63mrn4k5";
    })
    { };

  dev = pkgs.writeShellScriptBin "dev" ''
    yarn dev
  '';
in
pkgs.stdenv.mkDerivation {
  name = "shell";
  buildInputs = [
    pkgs.deno
    pkgs.nixpkgs-fmt
    pkgs.typescript
    pkgs.yarn
    dev
  ];

  shellHook = ''
    export PATH=$( yarn bin ):$PATH
    # keep it fresh
    yarn
  '';
}
