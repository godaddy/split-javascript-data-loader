[![Join Slack](https://img.shields.io/badge/Join%20us%20on-Slack-e01563.svg)](https://godaddy-oss-slack.herokuapp.com/)

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
      "segment_1": "{ name: 'segment_1', added: ['test-visitor-1', 'test-visitor-2', 'test-shopper-1'] }",
      "segment_2": "{ name: 'segment_2', added: ['test-visitor-1', 'test-visitor-3', 'test-shopper-2'] }"
    },
    since: '100',
    splitsData: {
      "experiment_1": "{ name: 'experiment_1', status: 'foo' }",
      "experiment_2": "{ name: 'experiment_2', status: 'bar' }"
    },
    usingSegmentsCount: 2
  },
  userId: 'test-visitor-1'
})
// console.log(window.localStorage)
// {
//   "SPLITIO.splits.till": "100",
//   "SPLITIO.split.experiment_1": "{ name: 'experiment_1', status: 'foo' }",
//   "SPLITIO.split.experiment_2": "{ name: 'experiment_2', status: 'bar' }",
//   "SPLITIO.splits.usingSegments": "2",
//   "test-visitor-1.SPLITIO.segment.segment_1": "1",
//   "test-visitor-1.SPLITIO.segment.segment_2": "1"
// }
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
| storagePrefix                     | An optional parameter that represents the storage.prefix in the [SplitIO configuration](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#configuration) of the SplitIO factory you are using. |

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
