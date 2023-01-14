import React, { ForwardedRef, forwardRef, SyntheticEvent } from 'react';
import { Query, useMutation } from 'react-query';
import { CartType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import ItemData from '../../pages/cart/itemData';
import { getClient, graphqlFetcher, QueryKeys } from '../../queryClient';

const CartItem = ({ id, imageUrl, price, title, amount }: CartType, ref: ForwardedRef<HTMLInputElement>) => {
  const queryClient = getClient();
  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) => graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKeys.CART);
        const prevCart = queryClient.getQueryData<{ [key: string]: CartType }>(QueryKeys.CART);
        if (!prevCart?.[id]) return prevCart;

        const newCart = {
          ...(prevCart || {}),
          [id]: { ...prevCart[id], amount },
        };
        queryClient.setQueryData(QueryKeys.CART, newCart);

        return prevCart;
      },
      onSuccess: (newValue) => {
        const prevCart = queryClient.getQueryData<{ [key: string]: CartType }>(QueryKeys.CART);
        const newCart = {
          ...(prevCart || {}),
          [id]: newValue,
        };
        queryClient.setQueryData(QueryKeys.CART, newCart);
      },
    }
  );

  const { mutate: deleteCart } = useMutation(({ id }: { id: string }) => graphqlFetcher(DELETE_CART, { id }), {
    onSuccess: () => {
      // delete 후 get으로 다시 가져옴
      queryClient.invalidateQueries(QueryKeys.CART);
    },
  });

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    if (amount < 1) return;
    updateCart({ id, amount });
  };

  const handleDeleteItem = () => {
    deleteCart({ id });
  };
  return (
    <li className="cart-item">
      <input className="cart-item__checkbox" type="checkbox" name={`select-item`} ref={ref} data-id={id} />
      <ItemData imageUrl={imageUrl} price={price} title={title} />
      <input type="number" className="cart-item__amount" value={amount} onChange={handleUpdateAmount} min="1" />
      <button type="button" className="cart-item__button" onClick={handleDeleteItem}>
        삭제
      </button>
    </li>
  );
};

export default forwardRef(CartItem);