import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import {
  MyOrders as MyOrdersController
} from 'ordering-components'
import {
  MyOrdersContainer,
  MyOrdersTitle,
  ActiveOrders,
  Card,
  Map,
  Content,
  Logo,
  BusinessInformation,
  OpenOrder,
  Price,
  OrdersPast,
  IndividualOrderPast,
  OrderPastContent,
  Reorder,
  SkeletonOrder,
  SkeletonCard,
  SkeletonMap,
  SkeletonContent,
  SkeletonText,
  SkeletonOrdersPast,
  SkeletonReorder
} from './styles'

import { ProfileOptions } from '../UserProfileForm/ProfileOptions'
import { Button } from '../../styles/Buttons'
export const MyOrdersUI = (props) => {
  const { activeOrders, previousOrders } = props

  return (
    <>
      <ProfileOptions value='My Orders' />
      <MyOrdersContainer>
        {
          <>
            <MyOrdersTitle>
              {!activeOrders.loading ? (
                <h3>Active Orders</h3>
              ) : (
                <Skeleton width={200} height={20} />
              )}
            </MyOrdersTitle>
            <ActiveOrders>
              {!activeOrders.loading ? activeOrders.orders.map((order) => (
                <Card key={order.id}>
                  <Map>
                    <img src={`https://maps.googleapis.com/maps/api/staticmap?size=500x190&center=${order.business.location.lat},${order.business.location.lng}&zoom=17&scale=2&maptype=roadmap&&markers=icon:https://res.cloudinary.com/ditpjbrmz/image/upload/f_auto,q_auto,w_45,q_auto:best,q_auto:best/v1564675872/marker-customer_kvxric.png%7Ccolor:white%7C${order.business.location.lat},${order.business.location.lng}&key=AIzaSyDX5giPfK-mtbLR72qxzevCYSUrbi832Sk`} />
                  </Map>
                  <Content>
                    <Logo>
                      <img src={order.business?.logo} />
                    </Logo>
                    <BusinessInformation>
                      <h5>{order.business.name}</h5>
                      <p>Order No. {order.id}</p>
                      <p>{order.created_at}</p>
                    </BusinessInformation>
                    <Price>
                      <h5>
                        ${order.products.reduce((acc, cur) => acc + cur.price, 0)}
                      </h5>
                      <p>{order.status === 0 ? 'pending' : ''}</p>
                    </Price>
                  </Content>
                  <OpenOrder>
                    <Link to={'/orders/' + order.id}>
                      <Button color='primary'>
                        Open Order
                      </Button>
                    </Link>
                  </OpenOrder>
                </Card>
              )) : (
                <SkeletonOrder>
                  {[...Array(3)].map((item, i) => (
                    <SkeletonCard key={i}>
                      <SkeletonMap>
                        <Skeleton width={400} height={100} />
                      </SkeletonMap>
                      <SkeletonContent>
                        <div>
                          <Skeleton width={70} height={70} />
                        </div>
                        <SkeletonText>
                          <Skeleton width={100} />
                          <Skeleton width={80} />
                          <Skeleton width={120} />
                        </SkeletonText>
                      </SkeletonContent>
                    </SkeletonCard>
                  ))}
                </SkeletonOrder>
              )}
            </ActiveOrders>
          </>
        }
        {
          <>
            <MyOrdersTitle>
              {!previousOrders.loading ? (
                <h3>My Orders Past</h3>
              ) : (
                <Skeleton width={200} height={20} />
              )}
            </MyOrdersTitle>
            <OrdersPast>
              {!previousOrders.loading ? previousOrders.orders.map((order) => (
                <IndividualOrderPast key={order.id}>
                  <OrderPastContent>
                    <Logo name='order_past'>
                      <img src={order.business?.logo} />
                    </Logo>
                    <BusinessInformation>
                      <h5>{order.business.name}</h5>
                      <p>{order.created_at}</p>
                      <Link to={'/orders/' + order.id}>
                        <p name='view'>View order</p>
                      </Link>
                    </BusinessInformation>
                  </OrderPastContent>
                  <Reorder>
                    <p>{order.status === 1 || order.status === 11 ? 'Complete' : ''}</p>
                    <Button color='primary'>Reorder</Button>
                  </Reorder>
                </IndividualOrderPast>
              )) : ([...Array(3)].map((item, i) => (
                <SkeletonOrdersPast key={i}>
                  <SkeletonContent>
                    <div>
                      <Skeleton width={70} height={70} />
                    </div>
                    <SkeletonText>
                      <Skeleton width={100} />
                      <Skeleton width={120} />
                      <Skeleton width={80} />
                    </SkeletonText>
                    <SkeletonReorder>
                      <Skeleton width={80} />
                      <Skeleton width={150} height={40} />
                    </SkeletonReorder>
                  </SkeletonContent>
                </SkeletonOrdersPast>
              )))}
            </OrdersPast>
          </>
        }
      </MyOrdersContainer>
    </>
  )
}

export const MyOrders = (props) => {
  const MyOrdersProps = {
    ...props,
    UIComponent: MyOrdersUI
  }

  return <MyOrdersController {...MyOrdersProps} />
}
