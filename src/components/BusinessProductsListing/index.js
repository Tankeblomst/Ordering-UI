import React, { useState, useEffect, useCallback } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useLocation } from 'react-router-dom'
import {
  BusinessAndProductList,
  useEvent,
  useLanguage,
  useOrder,
  useSession,
  useUtils
} from 'ordering-components'

import {
  ProductsContainer,
  WrapContent,
  ProductsNotFound,
  ProductLoading,
  SkeletonItem,
  WrapperSearch
} from './styles'

import { NotFoundSource } from '../NotFoundSource'

import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { BusinessProductsCategories } from '../BusinessProductsCategories'
import { BusinessProductsList } from '../BusinessProductsList'
import { PageNotFound } from '../PageNotFound'
import { ProductForm } from '../ProductForm'
import { FloatingButton } from '../FloatingButton'
import { Modal } from '../Modal'
import { SearchBar } from '../SearchBar'
import { UpsellingPage } from '../UpsellingPage'
import { Select } from '../../styles/Select'

const PIXELS_TO_SCROLL = 300

const BusinessProductsListingUI = (props) => {
  const {
    errors,
    isInitialRender,
    businessState,
    categorySelected,
    searchValue,
    sortByValue,
    categoryState,
    categoryId,
    productId,
    productModal,
    getNextProducts,
    handleChangeCategory,
    handleUpdateInitialRender,
    updateProductModal,
    onProductRedirect,
    onCheckoutRedirect,
    handleChangeSearch,
    handleSearchRedirect,
    featuredProducts,
    handleChangeSortBy
  } = props

  const { business, loading, error } = businessState
  const [, t] = useLanguage()
  const [{ carts }] = useOrder()
  const [{ parsePrice }] = useUtils()

  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState(props.product)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [events] = useEvent()
  const [{ auth }] = useSession()
  const location = useLocation()

  const currentCart = Object.values(carts).find(cart => cart?.business?.slug === business?.slug) ?? {}

  const sortByOptions = [
    { value: null, content: t('SORT_BY', 'Sort By'), showOnSelected: t('SORT_BY', 'Sort By') },
    { value: 'rank', content: t('RANK', 'Rank'), showOnSelected: t('RANK', 'Rank') },
    { value: 'a-z', content: t('A_to_Z', 'A-Z'), showOnSelected: t('A_to_Z', 'A-Z') }
  ]

  const handler = () => {
    setOpenBusinessInformation(true)
  }

  const onProductClick = (product) => {
    onProductRedirect({
      slug: business?.slug,
      product: product.id,
      category: product.category_id
    })
    setCurProduct(product)
    setModalIsOpen(true)
  }

  const handlerProductAction = (product) => {
    if (Object.keys(product).length) {
      setModalIsOpen(false)
      onProductRedirect({
        slug: business?.slug
      })
    }
  }

  const closeModalProductForm = () => {
    setModalIsOpen(false)
    handleUpdateInitialRender(false)
    updateProductModal(null)
    setCurProduct(null)
    onProductRedirect({
      slug: business?.slug
    })
  }

  const handleScroll = useCallback(() => {
    const innerHeightScrolltop = window.innerHeight + document.documentElement?.scrollTop + PIXELS_TO_SCROLL
    const badScrollPosition = innerHeightScrolltop < document.documentElement.offsetHeight
    const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
    if (badScrollPosition || categoryState.loading || !hasMore) return
    getNextProducts()
  }, [categoryState])

  const handleChangePage = (data) => {
    if (Object.entries(data.query).length === 0 && openProduct) {
      setModalIsOpen(false)
    }
  }

  const handleUpsellingPage = () => {
    onCheckoutRedirect(currentCart?.uuid)
    setOpenUpselling(false)
    setCanOpenUpselling(false)
  }

  useEffect(() => {
    if (categoryId && productId && isInitialRender) {
      if (productModal?.product?.id) {
        setCurProduct(productModal.product)
      }
      setModalIsOpen(true)
    }
  }, [productModal])

  useEffect(() => {
    if (categoryId && productId) {
      handleUpdateInitialRender(true)
    }
    events.emit('get_current_view')
  }, [])

  useEffect(() => {
    events.on('change_view', handleChangePage)
    return () => {
      events.off('change_view', handleChangePage)
    }
  }, [openProduct])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <>
      <ProductsContainer>
        {
          !loading && business?.id && (
            <>
              <BusinessBasicInformation
                businessState={businessState}
                setOpenBusinessInformation={setOpenBusinessInformation}
                openBusinessInformation={openBusinessInformation}
              />
              {(categoryState.products.length !== 0 || searchValue) && (
                <WrapperSearch>
                  <SearchBar
                    onSearch={handleChangeSearch}
                    search={searchValue}
                    placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
                    lazyLoad={businessState?.business?.lazy_load_products_recommended}
                  />
                  <Select
                    notAsync
                    notReload
                    options={sortByOptions}
                    defaultValue={sortByValue}
                    onChange={(val) => handleChangeSortBy && handleChangeSortBy(val)}
                  />
                </WrapperSearch>
              )}
              {!(business?.categories?.length === 0 && !categoryId) && (
                <BusinessProductsCategories
                  categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a, b) => a.rank - b.rank)]}
                  categorySelected={categorySelected}
                  onClickCategory={handleChangeCategory}
                  featured={featuredProducts}
                  openBusinessInformation={openBusinessInformation}
                />
              )}

              <WrapContent>
                <BusinessProductsList
                  categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a, b) => a.rank - b.rank)]}
                  category={categorySelected}
                  categoryState={categoryState}
                  businessId={business.id}
                  errors={errors}
                  onProductClick={onProductClick}
                  handleSearchRedirect={handleSearchRedirect}
                  featured={featuredProducts}
                  searchValue={searchValue}
                  handleClearSearch={handleChangeSearch}
                />
              </WrapContent>
            </>
          )
        }

        <Modal
          width='70%'
          open={openProduct}
          closeOnBackdrop
          onClose={() => closeModalProductForm()}
          padding='0'
        >

          {productModal.loading && (
            <ProductLoading>
              <SkeletonItem>
                <Skeleton height={45} count={8} />
              </SkeletonItem>
            </ProductLoading>
          )}

          {productModal.error && productModal.error.length > 0 && (
            productModal.error.map((e, i) => (
              <p key={i}>{t('ERROR', 'Error')}: [{e.message}]</p>
            ))
          )}

          {isInitialRender && !productModal.loading && !productModal.error && !productModal.product && (
            <NotFoundSource
              content={t('ERROR_GET_PRODUCT', 'Sorry, we couldn\'t find the requested product.')}
            />
          )}
          {(productModal.product || curProduct) && (
            <ProductForm
              businessSlug={business?.slug}
              product={productModal.product || curProduct}
              businessId={business?.id}
              onSave={handlerProductAction}
            />
          )}
        </Modal>
        {loading && (
          <>
            <BusinessBasicInformation
              businessState={{ business: {}, loading: true }}
              isSkeleton
              handler={handler}
              openBusinessInformation={openBusinessInformation}
            />
            <BusinessProductsCategories
              categories={[]}
              isSkeleton
              openBusinessInformation={openBusinessInformation}
            />
            <WrapContent>
              <BusinessProductsList
                categories={[]}
                category={categorySelected}
                categoryState={categoryState}
                isBusinessLoading={loading}
              />
            </WrapContent>
          </>
        )}

        {
          !loading && business && !Object.keys(business).length && (
            <NotFoundSource
              content={t('NOT_FOUND_BUSINESS_PRODUCTS', 'No products to show at this business, please try with other business.')}
              btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
              onClickButton={() => handleSearchRedirect()}
            />
          )
        }

        {
          !loading && !business && location.pathname.includes('/store/') && (
            <NotFoundSource
              content={t('ERROR_NOT_FOUND_STORE', 'Sorry, an error has occurred with business selected.')}
              btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
              onClickButton={handleSearchRedirect}
            />
          )
        }

        {
          !loading && !business && !location.pathname.includes('/store/') && (
            <PageNotFound />
          )
        }

        {error && error.length > 0 && (
          <ProductsNotFound>
            {error.map((e, i) => (
              <p key={i}>{t('ERROR', 'Error')}: [{e?.message || e}]</p>
            ))}
          </ProductsNotFound>
        )}
      </ProductsContainer>
      {currentCart?.products?.length > 0 && auth && (
        <FloatingButton
          btnText={
            currentCart?.subtotal >= currentCart?.minimum
              ? !openUpselling ? t('VIEW_ORDER', 'View Order') : t('LOADING', 'Loading')
              : `${t('MINIMUN_PURCHASE', 'Minimum')} ${parsePrice(currentCart?.minimum)}`
          }
          btnValue={currentCart?.products?.length}
          handleClick={() => setOpenUpselling(true)}
          disabled={openUpselling || currentCart?.subtotal < currentCart?.minimum}
        />
      )}
      {currentCart?.products && openUpselling && (
        <UpsellingPage
          businessId={currentCart?.business_id}
          business={currentCart?.business}
          cartProducts={currentCart?.products}
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
        />
      )}
    </>
  )
}

export const BusinessProductsListing = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(false)

  const businessProductslistingProps = {
    ...props,
    UIComponent: BusinessProductsListingUI,
    isInitialRender,
    handleUpdateInitialRender: (val) => setIsInitialRender(val)
  }

  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
