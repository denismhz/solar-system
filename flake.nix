{
  inputs = {
    nixpkgs-stable.url = "github:nixos/nixpkgs/nixos-23.11";
    solar-system-src.url = "github:denismhz/solar-system";
    solar-system-src.flake = false;
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { flake-utils, nixpkgs-stable, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs-stable.legacyPackages.${system}; in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [ pkgs.nodejs pkgs.nodePackages.npm ];
          shellHook = ''
            npm install --legacy-peer-deps
          '';
        };
        packages.default = pkgs.buildNpmPackage rec {
          pname = "solar-system";
          version = "1.0.0";

          src = pkgs.fetchFromGitHub {
            owner = "denismhz";
            rev = "4f22c27a898ed8ec5ba90eb7da85fd888dedfa46";
            repo = pname;
            hash = "sha256-2vEwo3PygvWY0d0OFgUnqAs+cD5fvr1jLeTKPReeBCM=";
          };

          npmDepsHash = "sha256-XBpKLJRBjBdJFQAgyoe0slai0jerEAcVgY8vstxMylc=";
          npmFlags = [ "--legacy-peer-deps" ];

          meta = with pkgs.lib; {
            description = "solar-system";
            homepage = "https://flood.js.org";
          };
        };
      });
}
