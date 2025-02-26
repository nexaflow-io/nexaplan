# NexaPlan 実装メモ

## エディターとプレビューの連携機能

### ホバープレビュー機能

#### 実装概要
ホバープレビュー機能は、プレビュー上の要素にマウスカーソルを合わせると、対応するマークダウンコードが自動的にハイライトされる機能です。この機能により、ユーザーはプレゼンテーションのどの部分がマークダウンのどの部分に対応しているかを直感的に理解できます。

#### 技術的実装

1. **位置情報の追跡**
   - `PositionTrackingMarp` クラスを拡張して、マークダウンの各要素の行番号を追跡
   - 各HTML要素に `data-position` 属性を追加し、対応するマークダウンの行番号を保存
   - 実際のマークダウンの行番号（0ベース）を直接使用することで正確な位置特定を実現

2. **イベントハンドリング**
   - プレビュー要素に `mouseover` イベントリスナーを追加
   - ホバーされた要素またはその親要素から `data-position` 属性を取得
   - 取得した行番号を使用して、エディター内の対応する行にカーソルを移動

3. **スタイル最適化**
   - ホバー時にスライドのサイズが変わらないよう、CSS で `transform: none` と `transition: none` を設定
   - 一貫したユーザー体験のために視覚的な安定性を確保

#### デバッグと改善点

実装中に以下の課題が発生し、解決されました：

1. **位置情報の不一致**
   - 問題: 初期実装では位置情報のインデックスを使用していたため、実際のマークダウン行番号と一致しなかった
   - 解決策: マークダウンパーサーが提供する実際の行番号（`token.map`）を直接使用するように変更

2. **要素の視覚的変化**
   - 問題: ホバー時にスライドのサイズが変わる問題
   - 解決策: CSS で変形や遷移効果を無効化

3. **行番号の計算**
   - 問題: エディターとプレビューで行番号の基準（0ベースか1ベースか）が異なっていた
   - 解決策: デバッグ情報を追加し、適切な行番号の計算方法を実装

#### 今後の改善案

1. パフォーマンス最適化（大きなドキュメントでのイベント処理の効率化）
2. 双方向の連携（エディターでの選択がプレビューにも反映される機能）
3. モバイル対応（タッチイベントのサポート）
