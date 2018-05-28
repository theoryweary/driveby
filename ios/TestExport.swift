import Foundation
import Swift


@objc(TestExport)
class TestExport: NSObject {

  @objc
  func testConsole() -> Void {
    // Test is ready to use!
    print("test Swift  #######################")
  }

  @objc
  func constantsToExport() -> [String: Any]! {
    return ["someKey": "someValue"]
  }

}
