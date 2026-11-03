# Architecture

```
wholePrice, held, supply
        │
        ▼
   shareValue → value, remainder, product, exact
        │
        ├── ownershipBps
        ├── comparePrices
        ├── sumHolderFloors
        └── exportSliceMarkdown
```

Honesty boundary: no market feed, no wallet, no broadcast.
