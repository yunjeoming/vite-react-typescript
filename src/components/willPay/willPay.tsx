import React, { SyntheticEvent } from 'react';
import { useRecoilValue } from 'recoil';
import ItemData from '../../pages/cart/itemData';
import { checkedCartState } from '../../recoils/cart';

const WillPay = ({ submitTitle, handleSubmit }: { submitTitle: string; handleSubmit: (e: SyntheticEvent) => void }) => {
  const checkedItems = useRecoilValue(checkedCartState);
  const totalPrice = checkedItems.reduce((res, { price, amount }) => {
    res += price * amount;
    return res;
  }, 0);

  return (
    <div className="cart-willpay">
      <ul>
        {checkedItems.map(({ imageUrl, price, title, id, amount }) => (
          <li>
            <ItemData key={id} imageUrl={imageUrl} price={price} title={title} />
            <p>수량 : {amount}</p>
            <p>금액 : {price * amount}</p>
          </li>
        ))}
      </ul>
      <p>총 예상 결제액 : {totalPrice}</p>
      <button onClick={handleSubmit}>{submitTitle}</button>
    </div>
  );
};

export default WillPay;
