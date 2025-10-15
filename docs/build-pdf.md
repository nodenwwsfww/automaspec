nix-shell -p pandoc mermaid-filter texliveSmall
pandoc -F mermaid-filter -o docs/BA-Requirements.pdf docs/BA-Requirements.md