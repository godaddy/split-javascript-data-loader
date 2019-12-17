# split-javascript-data-loader

 Loads serialized rule/segment data from Split.io into the browser local storage.

## Installation

Install via npm:

```console
$ npm i @godaddy/split-data-loader --save
```

## Usage

Use this package if you are using Split.io for experimentation on a webpage and want to take advantage of browser caching with [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Please note that this package is intended to be used in tandem with a split data serializer to create the `serializedData` parameter properly.
An example of such serializer is [`split-node-serializer`](https://github.com/godaddy/split-node-serializer).

```js
import loadDataIntoLocalStorage from '@godaddy/split-data-loader'

loadDataIntoLocalStorage({
  serializedData: {
    segmentsData: {
      "segment_1": ['test-visitor-1', 'test-visitor-2', 'test-shopper-1'],
      "segment_2": ['test-visitor-1', 'test-visitor-3', 'test-shopper-2']
    },
    since: '-1',
    splitsData: {
      "experiment_1": "{ name: 'experiment_1', status: 'foo' }",
      "experiment_2": "{ name: 'experiment_2', status: 'bar' }"
    },
    usingSegmentsCount: 2
  },
  userId: 'test-visitor-1'
})
```

### Function

#### loadDataIntoLocalStorage

You can use this function to store the following in browser `localStorage`:
- Freshness of your data
- Serialized split data
- Count of splits using segments
- Indicators for which segments a `userId` is a part of

The following option properties are available:

| Property                          | Description |
|-----------------------------------|-------------|
| serializedData.segmentsData       | An object of segment data you want to use to cache which segments a given `userId` is part of. (required) |
| serializedData.since              | The freshness of the incoming serialized data. If this is less than or equal to the `since` value in localStorage, nothing will happen. (required) |
| serializedData.splitsData         | An object of serialized split data you want to cache. (required) |
| serializedData.usingSegmentsCount | The count of splits using segments. (required) |
| userId                            | The user id that is a part of an experiment. Either a hashed shopperId or visitorGuid. (required) |

## Testing

Run the linter:

```console
$ npm run lint
```

Run unit tests:

```console
$ npm test
```

Generate a coverage report:

```console
$ npm run coverage
```

## License

[MIT](LICENSE)
