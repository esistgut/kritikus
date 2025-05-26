import { queryParams, type QueryParams } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SoundController::index
* @see app/Http/Controllers/SoundController.php:13
* @route '/'
*/
export const index = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ['get','head'],
    url: '/',
}

/**
* @see \App\Http\Controllers\SoundController::index
* @see app/Http/Controllers/SoundController.php:13
* @route '/'
*/
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SoundController::index
* @see app/Http/Controllers/SoundController.php:13
* @route '/'
*/
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SoundController::index
* @see app/Http/Controllers/SoundController.php:13
* @route '/'
*/
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SoundController::store
* @see app/Http/Controllers/SoundController.php:20
* @route '/sounds'
*/
export const store = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '/sounds',
}

/**
* @see \App\Http\Controllers\SoundController::store
* @see app/Http/Controllers/SoundController.php:20
* @route '/sounds'
*/
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SoundController::store
* @see app/Http/Controllers/SoundController.php:20
* @route '/sounds'
*/
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SoundController::update
* @see app/Http/Controllers/SoundController.php:44
* @route '/sounds/{sound}'
*/
export const update = (args: { sound: number | { id: number } } | [sound: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '/sounds/{sound}',
}

/**
* @see \App\Http\Controllers\SoundController::update
* @see app/Http/Controllers/SoundController.php:44
* @route '/sounds/{sound}'
*/
update.url = (args: { sound: number | { id: number } } | [sound: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sound: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sound: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sound: args[0],
        }
    }

    const parsedArgs = {
        sound: typeof args.sound === 'object'
        ? args.sound.id
        : args.sound,
    }

    return update.definition.url
            .replace('{sound}', parsedArgs.sound.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SoundController::update
* @see app/Http/Controllers/SoundController.php:44
* @route '/sounds/{sound}'
*/
update.put = (args: { sound: number | { id: number } } | [sound: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\SoundController::destroy
* @see app/Http/Controllers/SoundController.php:57
* @route '/sounds/{sound}'
*/
export const destroy = (args: { sound: number | { id: number } } | [sound: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '/sounds/{sound}',
}

/**
* @see \App\Http\Controllers\SoundController::destroy
* @see app/Http/Controllers/SoundController.php:57
* @route '/sounds/{sound}'
*/
destroy.url = (args: { sound: number | { id: number } } | [sound: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sound: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sound: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sound: args[0],
        }
    }

    const parsedArgs = {
        sound: typeof args.sound === 'object'
        ? args.sound.id
        : args.sound,
    }

    return destroy.definition.url
            .replace('{sound}', parsedArgs.sound.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SoundController::destroy
* @see app/Http/Controllers/SoundController.php:57
* @route '/sounds/{sound}'
*/
destroy.delete = (args: { sound: number | { id: number } } | [sound: number | { id: number } ] | number | { id: number }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const SoundController = { index, store, update, destroy }

export default SoundController