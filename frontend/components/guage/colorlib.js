export const getColour = value => {
  var colours = {
    20: '#57bb8a',
    19: '#63b682',
    18: '#73b87e',
    17: '#84bb7b',
    16: '#94bd77',
    15: '#a4c073',
    14: '#b0be6e',
    13: '#c4c56d',
    12: '#d4c86a',
    11: '#e2c965',
    10: '#f5ce62',
    9: '#f3c563',
    8: '#e9b861',
    7: '#e6ad61',
    6: '#ecac67',
    5: '#e9a268',
    4: '#e79a69',
    3: '#e5926b',
    2: '#e2886c',
    1: '#e0816d',
    0: '#dd776e'
  }
  var length = Object.keys(colours).length
  var min = 0
  var max = 850
  var colour

  if (colours[Math.floor(value / (max / length))] !== undefined) {
    colour = colours[Math.floor(value / (max / length))]
    return colours[Math.floor(value / (max / length))]
  } else {
    colour = colours[20]
    return colours[20]
  }
}
