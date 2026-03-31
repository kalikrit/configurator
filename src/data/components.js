export const components = {
  cpu: [
    { id: 'cpu1', name: 'AMD Ryzen 5 5600', category: 'cpu', socket: 'AM4', tdp: 65, price: 12000 },
    { id: 'cpu2', name: 'AMD Ryzen 7 7700X', category: 'cpu', socket: 'AM5', tdp: 105, price: 28000 },
    { id: 'cpu3', name: 'Intel Core i5-13400', category: 'cpu', socket: 'LGA1700', tdp: 65, price: 18000 },
    { id: 'cpu4', name: 'Intel Core i7-13700K', category: 'cpu', socket: 'LGA1700', tdp: 125, price: 35000 },
    { id: 'cpu5', name: 'AMD Ryzen 9 7950X', category: 'cpu', socket: 'AM5', tdp: 170, price: 55000 }
  ],
  motherboard: [
    { id: 'mb1', name: 'MSI B550-A PRO', category: 'motherboard', socket: 'AM4', price: 10000 },
    { id: 'mb2', name: 'ASUS TUF GAMING B650-PLUS', category: 'motherboard', socket: 'AM5', price: 18000 },
    { id: 'mb3', name: 'Gigabyte B760 AORUS ELITE', category: 'motherboard', socket: 'LGA1700', price: 17000 },
    { id: 'mb4', name: 'ASRock Z790 Steel Legend', category: 'motherboard', socket: 'LGA1700', price: 22000 },
    { id: 'mb5', name: 'ASUS ROG STRIX B650-I', category: 'motherboard', socket: 'AM5', price: 21000 }
  ],
  gpu: [
    { id: 'gpu1', name: 'NVIDIA GeForce RTX 3060', category: 'gpu', powerConsumption: 170, recommendedPsu: 550, price: 30000 },
    { id: 'gpu2', name: 'NVIDIA GeForce RTX 3060 Ti', category: 'gpu', powerConsumption: 200, recommendedPsu: 600, price: 40000 },
    { id: 'gpu3', name: 'NVIDIA GeForce RTX 4070', category: 'gpu', powerConsumption: 200, recommendedPsu: 650, price: 60000 },
    { id: 'gpu4', name: 'NVIDIA GeForce RTX 4080', category: 'gpu', powerConsumption: 320, recommendedPsu: 750, price: 95000 },
    { id: 'gpu5', name: 'NVIDIA GeForce RTX 4090', category: 'gpu', powerConsumption: 450, recommendedPsu: 850, price: 150000 }
  ],
  psu: [
    { id: 'psu1', name: 'be quiet! System Power 10 550W', category: 'psu', power: 550, price: 5000 },
    { id: 'psu2', name: 'Corsair CX650M 650W', category: 'psu', power: 650, price: 7000 },
    { id: 'psu3', name: 'be quiet! Pure Power 12 M 750W', category: 'psu', power: 750, price: 9000 },
    { id: 'psu4', name: 'Seasonic Focus GX 850W', category: 'psu', power: 850, price: 12000 },
    { id: 'psu5', name: 'Corsair RM1000e 1000W', category: 'psu', power: 1000, price: 15000 }
  ]
}