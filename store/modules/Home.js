import axios from 'axios'
//import router from '../router'

export default {
    state: {
        siteColor: JSON.parse(localStorage.getItem('siteColor')) ? JSON.parse(localStorage.getItem('siteColor')) : 'blue',
        currentUser: '',
        filteredProducts: [],
        regions: [],
        governorates: [],
        products: [],
        suppliers: [],
        allSuppliers: [],
        category: [],
        categoriesItems: [],
        categoryAndItemRequests: [],
        categoryRequestMessage: '',
        supplierCategoriesRequests: []
    },

    mutations: {
        // eslint-disable-next-line no-unused-vars


        getSiteColor(state, siteColors) {
            localStorage.setItem('siteColor', JSON.stringify(siteColors))

            state.siteColor = JSON.parse(localStorage.getItem('siteColor'))
        },

        refreshCurrentUser(state, user) {
            console.log('new user is ', user)
            state.currentUser = user;
        },

        emptyProductsArray(state) {
            state.filteredProducts = [];
        },

        getRegions(state, regions) {
            console.log('sate entered')
            state.regions = []
            for (var i = 0; i < regions.length; i++) {
                state.regions.push(regions[i].city)
            }
            console.log(state.regions)
        },

        getGovernorate(state, res) {
            state.governorates = res
        },

        getProducts(state, products) {
            state.products.push(...products);
            state.filteredProducts.push(...products);
        },

        getSuppliers(state, suppliers) {
            state.suppliers.push(...suppliers);
            state.allSuppliers.push(...suppliers);
        },

        categoriesDB(state, data) {
            state.category = data.map(e => {
                return e.category_name
            })

        },

        filterProducts(state, products) {
            state.filteredProducts = products;
        },

        filterSuppliers(state, users) {
            state.suppliers = users;
        },

        emptySearch(state) {
            state.filteredProducts = state.products
        },

        emptySupplierName(state) {
            state.suppliers = state.allSuppliers
        },

        changeSiteColor(state, supplier) {
            console.log('entered change site color')
            localStorage.setItem('siteColor', supplier.page_color)
            state.siteColor = localStorage.getItem('siteColor');
        },

        supplierPageColor(state, color) {
            console.log('color of supp', color)
            localStorage.setItem('siteColor', color)
            state.siteColor = localStorage.getItem('siteColor')
        },

        getCategoryItems(state, items) {
            state.categoriesItems = items
            console.log('get categories ittems', items)
        },
        getCategoryAndItemRequests(state, requests) {
            state.categoryAndItemRequests = requests
        },
        categoryAndItemRequestStatus(state, message) {
            state.categoryRequestMessage = message
        },
        getSupplierCategoriesRequests(state, supplierCategoriesRequests) {
            state.supplierCategoriesRequests = supplierCategoriesRequests
        }


    },


    actions: {
        removeSupplierPageData(context) {
            context.commit('removeSupplierPageData')
        },

        getSiteColor(context) {
            axios.put('http://localhost:3000/api/getSiteColor')
                .then(response => {
                    console.log(response.data.data)
                    console.log(response.data.message)
                    context.commit('getSiteColor', response.data.data)
                })
        },

        async refreshCurrentUser(context) {
            await axios.post('http://localhost:3000/api/refreshCurrentUser', {
                token: context.rootState.RegisterLogin.loginToken
            }).then(response => {
                context.commit('refreshCurrentUser', response.data.user)
            })
        },

        getGovernorate(context) {
            axios.put('http://localhost:3000/api/getGovernorate')
                .then(res => {
                    console.log(res.data.data)
                    context.commit('getGovernorate', res.data.data)
                })
        },

        getProducts(context, {
            productFilterFlag,
            productName,
            categoryName
        }) {
            if (!productFilterFlag) {
                axios.post('http://localhost:3000/api/products', {
                    product_id: context.state.filteredProducts.length > 0 ? context.state.filteredProducts[context.state.filteredProducts.length - 1].product_id : null
                }).then(response => {
                    context.commit('getProducts', response.data.products);
                    console.log('productss iss', response.data)
                })
            }
            else {
                axios.post('http://localhost:3000/api/loadMoreProductsWithFilter', {
                    product_id: context.state.filteredProducts.length > 0 ? context.state.filteredProducts[context.state.filteredProducts.length - 1].product_id : null,
                    product_name: productName,
                    category_name: categoryName
                }).then(response => {
                    context.commit('getProducts', response.data.products);
                    console.log('productss iss', response.data)
                })
            }
        },

        getSuppliers(context, {
            supplierFilterFlag,
            supplierName,
            governorate,
            region
        }) {
            if (!supplierFilterFlag) {
                axios.post('http://localhost:3000/api/getSuppliers', {
                    user_id: context.state.suppliers.length > 0 ? context.state.suppliers[context.state.suppliers.length - 1].user_id : null
                }).then(response => {
                    console.log(response.data.users)
                    context.commit('getSuppliers', response.data.users)
                })
            }
            else {
                axios.post('http://localhost:3000/api/loadMoreSuppliersWithFilter', {
                    user_id: context.state.suppliers.length > 0 ? context.state.suppliers[context.state.suppliers.length - 1].user_id : null,
                    name: supplierName,
                    governorate,
                    region
                }).then(response => {
                    console.log(response.data.users)
                    context.commit('getSuppliers', response.data.users)
                })
            }
        },

        categoriesDB(context) {
            axios.put('http://localhost:3000/api/selectCategory')
                .then((res) => {
                    console.log(res.data.data)
                    context.commit('categoriesDB', res.data.data)
                })
        },

        filterProducts(context, {
            product_name,
            category_name,
            governorate,
            region,
            categoryItem
        }) {

            axios.put('http://localhost:3000/api/filterProducts', {
                product_name,
                category_name,
                governorate,
                region,
                categoryItem
            })
                .then(response => {
                    console.log('message:', response.data.message)
                    console.log('products:', response.data.data)

                    context.commit('filterProducts', response.data.data);
                })
        },

        filterSuppliers(context, {
            supplierName,
            governorate,
            region
        }) {
            console.log('governorate', governorate)
            console.log('region', region)

            axios.put('http://localhost:3000/api/filterSuppliers', {
                user_id: context.state.suppliers.length > 0 ? context.state.suppliers[context.state.suppliers.length - 1].user_id : null,
                name: supplierName,
                governorate: governorate,
                region: region
            }).then(response => {
                console.log(response)
                context.commit('filterSuppliers', response.data.users)
            })
        },

        getRegions(context, governorate) {
            console.log(governorate)
            axios.put('http://localhost:3000/api/getRegions', { governorate: governorate })
                .then(regions => {
                    console.log('regionss', regions.data.data)
                    context.commit('getRegions', regions.data.data)
                })
        },

        addNewCategory(context, categoryName) {
            axios.post('http://localhost:3000/api/addNewCategory', { categoryName: categoryName })
                .then(message => {
                    console.log(message.data.message)
                    alert(message.data.message)

                })
        },
        addCategoryItems(context, { categoryName, categoryItem }) {
            axios.post('http://localhost:3000/api/addCategoryItems', { categoryName: categoryName, categoryItem: categoryItem })
                .then(message => {
                    console.log(message.data.message)
                    alert(message.data.message)
                })
        },
        getCategoryItems(context) {
            axios.put('http://localhost:3000/api/getCategoryItems')
                .then(response => {
                    console.log(response.data.message)
                    console.log('get category items', response.data.data)
                    context.commit('getCategoryItems', response.data.data)
                })


        },
        removeCategoryAndItems(context, { categoryName, categoryItem }) {
            axios.put('http://localhost:3000/api/removeCategoryAndItems', { categoryName: categoryName, categoryItem: categoryItem })
                .then(message => {
                    console.log(message.data.message)
                    alert(message.data.message)
                })
        },
        requestNewCategoryAndItem(context, {
            newCategoryName,
            newCategoryDescription,
            newCategoryItem,
            newCategoryItemDescription,
            categoryName }) {

            axios.post('http://localhost:3000/api/requestNewCategoryAndItem', {
                newCategoryName,
                newCategoryDescription,
                newCategoryItem,
                newCategoryItemDescription,
                categoryName,
                user_id: context.state.currentUser.user_id
            }).then(res => {
                console.log(res.data.message)
                console.log(res.data.data)
            })
        },
        getCategoryAndItemRequests(context) {
            axios.get('http://localhost:3000/api/getCategoryAndItemRequests')
                .then(requests => {

                    context.commit('getCategoryAndItemRequests', requests.data.data)
                })
        },
        categoryAndItemRequestStatus(context, { id, status,
            newCategoryName,
            newCategoryDescription,
            newCategoryItem,
            newItemCategoryName,
            requestType,
        }) {
            axios.put('http://localhost:3000/api/categoryAndItemRequestStatus', {
                id, status,
                newCategoryName,
                newCategoryDescription,
                newCategoryItem,
                newItemCategoryName,
                requestType,
            })
                .then(message => {
                    context.commit('categoryAndItemRequestStatus', message.data.message)
                })
        },
        getSupplierCategoriesRequests(context) {
            console.log('user idd issssss', context.state.currentUser.user_id)
            axios.put('http://localhost:3000/api/getSupplierCategoriesRequests', { user_id: context.state.currentUser.user_id })
                .then(requests => {
                    console.log(requests.data.message);
                    console.log('Requueests get', requests.data.data)
                    context.commit('getSupplierCategoriesRequests', requests.data.data)
                }

                )
        },
        updateSiteColors(context, {
            toolBarColor,
            footerColor,
            buttonsColor,
            buttonsTextColor,
            footerTextColor,
            toolBarTextColor
        }) {
            axios.post('http://localhost:3000/api/updateSiteColors', {
                toolBarColor,
                footerColor,
                buttonsColor,
                buttonsTextColor,
                footerTextColor,
                toolBarTextColor
            })
                .then(message => {
                    console.log(message.data.message);
                })
        },


    }
}