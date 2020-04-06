'use strict';

function printReceipt(orders) {
  let groupedOrdersWithQuantity = countQuantityOfEachItem(orders)
  const allItems = loadAllItems()
  let receiptItems = aggerateOrdersToItems(groupedOrdersWithQuantity, allItems)
  const receipt = generateReceipt(receiptItems)
  console.log(receipt)
}

function countQuantityOfEachItem(orders) {
  let groupedOrdersWithQuantity = []
  orders.forEach(order => {
    const matchedOrderWithQuantity = groupedOrdersWithQuantity.find(orderWithQuantity => orderWithQuantity.item === order)
    if (matchedOrderWithQuantity !== undefined) {
      matchedOrderWithQuantity.quantity += 1
    } else {
      groupedOrdersWithQuantity.push({
        item: order,
        quantity: 1
      })
    }
  })
  return groupedOrdersWithQuantity
}

function aggerateOrdersToItems(groupedOrdersWithQuantity, allItems) {
  return groupedOrdersWithQuantity.map(order => {
    let matchItem = allItems.find(item => item.barcode === order.item)
    return {
      ...matchItem,
      quantity: order.quantity
    }
  })
}

function generateReceipt(receiptItems) {
  let receiptObject = calculateTotal(receiptItems)
  let receipt = formatReceipt(receiptObject)
  return receipt
}

function calculateTotal(receiptItems) {
  let total = 0
  for (let receiptItem of receiptItems) {
    receiptItem.subtotal = receiptItem.price * receiptItem.quantity
    total += receiptItem.subtotal
  }
  return {
    receiptItems,
    total
  }
}

function formatReceipt(receiptObject) {
  let receiptString = '***<store earning no money>Receipt ***\n'
  for (let item of receiptObject.receiptItems) {
    const postfixOfUnit = item.quantity > 1 ? 's' : ''
    receiptString += `Name：${item.name}，Quantity：${item.quantity} ${item.unit + postfixOfUnit}，Unit：${item.price.toFixed(2)} (yuan)，Subtotal：${item.subtotal.toFixed(2)} (yuan)\n`
  }
  receiptString += '----------------------\n'
  receiptString += `总计：${receiptObject.total.toFixed(2)} (yuan)\n`
  receiptString += '**********************'
  return receiptString
}